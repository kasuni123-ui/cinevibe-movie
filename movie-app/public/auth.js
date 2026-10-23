/* ============================================================
   VALE AUTH — client-side accounts with hardened storage
   ------------------------------------------------------------
   • PBKDF2-SHA256, 310 000 iterations, 16-byte random salt/user
   • Constant-time hash comparison
   • Account lockout after 5 failed attempts (15 min)
   • Uniform "invalid email or password" errors (no enumeration)
   • Random 256-bit session token, absolute + idle expiry
   • No plaintext passwords ever written to storage
   ============================================================ */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     CONFIG
  --------------------------------------------------------- */
  const CONFIG = {
    PBKDF2_ITERATIONS: 310000,
    SALT_BYTES: 16,
    KEY_BITS: 256,

    MIN_PASSWORD: 12,
    MAX_PASSWORD: 256,
    MAX_ATTEMPTS: 5,
    LOCKOUT_MS: 15 * 60 * 1000,

    SESSION_ABS_MS: 12 * 60 * 60 * 1000,               // 12 h
    SESSION_IDLE_MS: 30 * 60 * 1000,                   // 30 m
    SESSION_ABS_REMEMBER_MS: 30 * 24 * 60 * 60 * 1000, // 30 d
    SESSION_IDLE_REMEMBER_MS: 14 * 24 * 60 * 60 * 1000,// 14 d

    TOUCH_THROTTLE_MS: 60 * 1000,

    /* Optional: routes that require a signed-in user. */
    REQUIRE_FOR: []
  };

  const K_USERS   = "vale.auth.users.v1";
  const K_SESSION = "vale.auth.session.v1";

  /* ---------------------------------------------------------
     HELPERS
  --------------------------------------------------------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s).replace(/[<>&"']/g, c =>
    ({ "<":"&lt;", ">":"&gt;", "&":"&amp;", "\"":"&quot;", "'":"&#39;" }[c]));

  class AuthError extends Error {
    constructor(message, code) {
      super(message);
      this.name = "AuthError";
      this.code = code || "error";
    }
  }

  /* ---------------------------------------------------------
     CRYPTO
  --------------------------------------------------------- */
  const encoder = new TextEncoder();

  function secureContextOK() {
    return !!(window.isSecureContext && window.crypto && window.crypto.subtle);
  }

  function randomBytes(n) {
    const a = new Uint8Array(n);
    crypto.getRandomValues(a);
    return a;
  }

  function randomHex(bytes) {
    return Array.from(randomBytes(bytes), b => b.toString(16).padStart(2, "0")).join("");
  }

  function b64(bytes) {
    let s = "";
    const a = new Uint8Array(bytes);
    for (let i = 0; i < a.length; i++) s += String.fromCharCode(a[i]);
    return btoa(s);
  }

  function unb64(str) {
    const bin = atob(str);
    const a = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
    return a;
  }

  async function pbkdf2(password, salt, iterations) {
    const key = await crypto.subtle.importKey(
      "raw", encoder.encode(password), { name: "PBKDF2" }, false, ["deriveBits"]
    );
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
      key,
      CONFIG.KEY_BITS
    );
    return new Uint8Array(bits);
  }

  function timingSafeEqual(a, b) {
    if (!a || !b || a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
    return diff === 0;
  }

  /* ---------------------------------------------------------
     VALIDATION
  --------------------------------------------------------- */
  const COMMON = new Set([
    "password1234","password12345","123456789012","qwertyuiop12",
    "letmein12345","iloveyou1234","admin1234567","welcome12345",
    "monkey123456","dragon123456","football1234","baseball1234",
    "sunshine1234","princess1234","abc123456789","trustno1thex"
  ]);

  function normalizeEmail(v) { return String(v || "").trim().toLowerCase(); }

  function isValidEmail(v) {
    if (!v || v.length > 254) return false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return false;
    const [local, domain] = v.split("@");
    if (!local || local.length > 64) return false;
    if (/\.\./.test(domain) || domain.startsWith(".") || domain.endsWith(".")) return false;
    return true;
  }

  function passwordProblems(pw, email, name) {
    const out = [];
    pw = String(pw || "");
    if (pw.length < CONFIG.MIN_PASSWORD)
      out.push(`Use at least ${CONFIG.MIN_PASSWORD} characters.`);
    if (pw.length > CONFIG.MAX_PASSWORD)
      out.push("That password is too long.");
    if (!/[a-z]/.test(pw)) out.push("Add a lowercase letter.");
    if (!/[A-Z]/.test(pw)) out.push("Add an uppercase letter.");
    if (!/[0-9]/.test(pw)) out.push("Add a number.");
    if (!/[^A-Za-z0-9]/.test(pw)) out.push("Add a symbol.");
    if (COMMON.has(pw.toLowerCase())) out.push("That password is too common.");
    if (/(.)\1{3,}/.test(pw)) out.push("Avoid repeating the same character four times.");
    const local = String(email || "").split("@")[0].toLowerCase();
    if (local.length >= 3 && pw.toLowerCase().includes(local))
      out.push("Password must not contain your email name.");
    const first = String(name || "").trim().toLowerCase().split(" ")[0];
    if (first && first.length >= 3 && pw.toLowerCase().includes(first))
      out.push("Password must not contain your name.");
    return out;
  }

  function strength(pw) {
    pw = String(pw || "");
    let s = 0;
    if (pw.length >= 8) s++;
    if (pw.length >= 12) s++;
    if (pw.length >= 16) s++;
    const classes = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(r => r.test(pw)).length;
    if (classes >= 3) s++;
    if (classes === 4 && pw.length >= 14) s++;
    return Math.min(4, s);
  }

  /* ---------------------------------------------------------
     STORAGE
  --------------------------------------------------------- */
  function readJSON(store, key, fallback) {
    try { const raw = store.getItem(key); return raw ? JSON.parse(raw) : fallback; }
    catch (_) { return fallback; }
  }

  function writeJSON(store, key, value) {
    try { store.setItem(key, JSON.stringify(value)); return true; }
    catch (_) { return false; }
  }

  const readUsers  = () => readJSON(localStorage, K_USERS, []);
  const writeUsers = list => writeJSON(localStorage, K_USERS, list);

  function clearSession() {
    try { localStorage.removeItem(K_SESSION); sessionStorage.removeItem(K_SESSION); } catch (_) {}
  }

  function startSession(user, remember) {
    const now = Date.now();
    const session = {
      token: randomHex(32),
      userId: user.id,
      createdAt: now,
      lastActive: now,
      expiresAt: now + (remember ? CONFIG.SESSION_ABS_REMEMBER_MS : CONFIG.SESSION_ABS_MS),
      idleMs: remember ? CONFIG.SESSION_IDLE_REMEMBER_MS : CONFIG.SESSION_IDLE_MS,
      remember: !!remember
    };
    clearSession();
    writeJSON(remember ? localStorage : sessionStorage, K_SESSION, session);
    return session;
  }

  function getSession() {
    const s = readJSON(localStorage, K_SESSION, null) || readJSON(sessionStorage, K_SESSION, null);
    if (!s || !s.token || !s.userId) return null;
    const now = Date.now();
    if (s.expiresAt <= now || (now - s.lastActive) > s.idleMs) { clearSession(); return null; }
    return s;
  }

  function currentUser() {
    const s = getSession();
    if (!s) return null;
    return readUsers().find(u => u.id === s.userId) || null;
  }

  /* ---------------------------------------------------------
     CORE API
  --------------------------------------------------------- */
  async function register({ name, email, password, confirm, terms }) {
    if (!secureContextOK()) throw new AuthError("Secure context required.", "insecure");

    const cleanName = String(name || "").trim().replace(/\s+/g, " ");
    if (cleanName.length < 2) throw new AuthError("Please enter your name.");
    if (cleanName.length > 60) throw new AuthError("That name is too long.");
    if (/[<>]/.test(cleanName)) throw new AuthError("Name contains invalid characters.");

    const mail = normalizeEmail(email);
    if (!isValidEmail(mail)) throw new AuthError("Enter a valid email address.");
    if (password !== confirm) throw new AuthError("Passwords do not match.");

    const problems = passwordProblems(password, mail, cleanName);
    if (problems.length) throw new AuthError(problems[0]);

    if (!terms) throw new AuthError("Please accept the terms to continue.");

    const users = readUsers();
    if (users.some(u => u.email === mail))
      throw new AuthError("An account with that email already exists.");

    const salt = randomBytes(CONFIG.SALT_BYTES);
    const hash = await pbkdf2(password, salt, CONFIG.PBKDF2_ITERATIONS);

    const user = {
      id: randomHex(16),
      name: cleanName,
      email: mail,
      salt: b64(salt),
      hash: b64(hash),
      iterations: CONFIG.PBKDF2_ITERATIONS,
      algo: "PBKDF2-SHA256",
      createdAt: Date.now(),
      lastLoginAt: null,
      loginCount: 0,
      failed: 0,
      lockedUntil: 0
    };

    users.push(user);
    writeUsers(users);
    return user;
  }

  async function login({ email, password, remember }) {
    if (!secureContextOK()) throw new AuthError("Secure context required.", "insecure");

    const GENERIC = "Invalid email or password.";
    const mail = normalizeEmail(email);

    if (!isValidEmail(mail) || !password) throw new AuthError(GENERIC);

    const users = readUsers();
    const user = users.find(u => u.email === mail);

    /* equalise timing so missing accounts can't be detected */
    if (!user) {
      try { await pbkdf2(password, randomBytes(CONFIG.SALT_BYTES), CONFIG.PBKDF2_ITERATIONS); }
      catch (_) {}
      throw new AuthError(GENERIC);
    }

    const now = Date.now();
    if (user.lockedUntil && user.lockedUntil > now) {
      throw new AuthError(
        `Account temporarily locked. Try again in ${fmtDuration(user.lockedUntil - now)}.`,
        "locked"
      );
    }

    const hash = await pbkdf2(password, unb64(user.salt), user.iterations || CONFIG.PBKDF2_ITERATIONS);
    const ok = timingSafeEqual(hash, unb64(user.hash));

    if (!ok) {
      user.failed = (user.failed || 0) + 1;
      if (user.failed >= CONFIG.MAX_ATTEMPTS) {
        user.lockedUntil = Date.now() + CONFIG.LOCKOUT_MS;
        user.failed = 0;
        writeUsers(users);
        throw new AuthError(
          `Too many failed attempts. Locked for ${Math.round(CONFIG.LOCKOUT_MS / 60000)} minutes.`,
          "locked"
        );
      }
      writeUsers(users);
      const left = CONFIG.MAX_ATTEMPTS - user.failed;
      throw new AuthError(`${GENERIC} ${left} attempt${left === 1 ? "" : "s"} left before lockout.`);
    }

    user.failed = 0;
    user.lockedUntil = 0;
    user.lastLoginAt = Date.now();
    user.loginCount = (user.loginCount || 0) + 1;
    writeUsers(users);

    startSession(user, !!remember);
    return user;
  }

  function logout() {
    clearSession();
    renderChip();
    closePanel();
    toast("Signed out.");
  }

  /* ---------------------------------------------------------
     FORMATTING
  --------------------------------------------------------- */
  function fmtDuration(ms) {
    if (ms <= 0) return "a moment";
    const m = Math.floor(ms / 60000);
    if (m < 1) return "less than a minute";
    if (m < 60) return m + (m === 1 ? " minute" : " minutes");
    const h = Math.floor(m / 60);
    if (h < 24) return h + "h " + (m % 60) + "m";
    const d = Math.floor(h / 24);
    return d + (d === 1 ? " day" : " days");
  }

  function initials(name) {
    return String(name || "?").trim().split(/\s+/).slice(0, 2)
      .map(w => w[0] || "").join("").toUpperCase() || "?";
  }

  /* ---------------------------------------------------------
     TOAST
  --------------------------------------------------------- */
  let toastEl = null, toastTimer = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "vale-toast";
      toastEl.style.zIndex = "600";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    requestAnimationFrame(() => toastEl.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2400);
  }

  /* ---------------------------------------------------------
     HEADER CHIP
  --------------------------------------------------------- */
  let signedIn = false;

  function mountChip() {
    const header = $(".site-header");
    if (!header || $("#authChip")) return;

    const chip = document.createElement("button");
    chip.type = "button";
    chip.id = "authChip";
    chip.className = "auth-chip";

    const anchor = $(".nav-bars", header);
    if (anchor) header.insertBefore(chip, anchor);
    else header.appendChild(chip);

    chip.addEventListener("click", e => {
      e.stopPropagation();
      if (currentUser()) togglePanel();
      else openAuth("login");
    });

    renderChip();
  }

  function renderChip() {
    const chip = $("#authChip");
    if (!chip) return;

    const u = currentUser();
    signedIn = !!u;

    if (u) {
      chip.innerHTML =
        `<span class="auth-avatar">${esc(initials(u.name))}</span>` +
        `<span class="auth-chip__label">${esc(u.name.split(" ")[0])}</span>`;
      chip.setAttribute("aria-label", "Account menu for " + u.name);
      chip.setAttribute("aria-haspopup", "true");
      chip.setAttribute("aria-expanded", "false");
    } else {
      chip.innerHTML = `<span class="auth-chip__label">Sign in</span>`;
      chip.setAttribute("aria-label", "Sign in or create an account");
      chip.removeAttribute("aria-haspopup");
      chip.removeAttribute("aria-expanded");
    }

    document.dispatchEvent(new CustomEvent("vale:auth", { detail: { user: u } }));
  }

  /* ---------------------------------------------------------
     ACCOUNT PANEL
  --------------------------------------------------------- */
  let panelEl = null;

  function buildPanel() {
    if (panelEl) return;
    panelEl = document.createElement("div");
    panelEl.className = "auth-panel";
    panelEl.id = "authPanel";
    panelEl.setAttribute("role", "dialog");
    panelEl.setAttribute("aria-label", "Account");
    document.body.appendChild(panelEl);
  }

  function togglePanel(force) {
    buildPanel();
    const open = typeof force === "boolean" ? force : !panelEl.classList.contains("is-open");
    if (open) renderPanel();
    panelEl.classList.toggle("is-open", open);
    const chip = $("#authChip");
    if (chip) chip.setAttribute("aria-expanded", String(open));
  }

  function closePanel() {
    if (panelEl) panelEl.classList.remove("is-open");
    const chip = $("#authChip");
    if (chip) chip.setAttribute("aria-expanded", "false");
  }

  function renderPanel() {
    const u = currentUser();
    const s = getSession();
    if (!u || !s) { closePanel(); return; }

    panelEl.innerHTML = `
      <div class="auth-panel__head">
        <div class="auth-panel__avatar">${esc(initials(u.name))}</div>
        <div>
          <div class="auth-panel__name">${esc(u.name)}</div>
          <div class="auth-panel__email">${esc(u.email)}</div>
        </div>
      </div>
      <dl class="auth-panel__meta">
        <div><dt>Session</dt><dd>${esc(fmtDuration(s.expiresAt - Date.now()))} left</dd></div>
        <div><dt>Sign-ins</dt><dd>${u.loginCount || 1}</dd></div>
        <div><dt>Member since</dt><dd>${new Date(u.createdAt).getFullYear()}</dd></div>
      </dl>
      <button type="button" class="btn small ghost" data-auth-signout>Sign out</button>`;

    panelEl.querySelector("[data-auth-signout]").addEventListener("click", logout);
  }

  /* ---------------------------------------------------------
     AUTH MODAL
  --------------------------------------------------------- */
  let overlayEl = null;

  function buildModal() {
    if (overlayEl) return;

    overlayEl = document.createElement("div");
    overlayEl.id = "authOverlay";
    overlayEl.className = "auth-overlay";
    overlayEl.setAttribute("aria-hidden", "true");

    overlayEl.innerHTML = `
      <div class="auth-scrim" data-auth-close></div>

      <div class="auth-card" role="dialog" aria-modal="true" aria-labelledby="authHeading">
        <button type="button" class="auth-x" data-auth-close aria-label="Close">&times;</button>

        <div class="auth-head">
          <div class="auth-mark">Ethan<em>Vale</em></div>
          <h2 id="authHeading">Sign in</h2>
          <p class="auth-sub">Members sync their watchlist, history and preferences.</p>
        </div>

        <div class="auth-tabs" role="tablist" aria-label="Account">
          <button type="button" class="auth-tab is-on" role="tab" aria-selected="true"  data-mode="login">Sign in</button>
          <button type="button" class="auth-tab"        role="tab" aria-selected="false" data-mode="register">Create account</button>
        </div>

        <div class="auth-note" id="authNote" hidden></div>

        <!-- ---------- LOGIN ---------- -->
        <form class="auth-form" id="formLogin" novalidate>
          <label class="auth-field">
            <span class="auth-label">Email</span>
            <input class="auth-input" type="email" name="email"
                   autocomplete="username" spellcheck="false"
                   maxlength="254" required>
          </label>

          <label class="auth-field">
            <span class="auth-label">Password</span>
            <span class="auth-pw">
              <input class="auth-input" type="password" name="password"
                     autocomplete="current-password" maxlength="256" required>
              <button type="button" class="auth-eye" data-eye aria-label="Show password">Show</button>
            </span>
          </label>

          <label class="auth-check">
            <input type="checkbox" name="remember">
            <span>Keep me signed in on this device</span>
          </label>

          <p class="auth-msg" data-msg role="alert" aria-live="polite"></p>

          <button class="btn primary auth-submit" type="submit">Sign in</button>

          <p class="auth-foot">
            <button type="button" class="auth-link" data-mode="register">No account yet? Create one</button>
          </p>
        </form>

        <!-- ---------- REGISTER ---------- -->
        <form class="auth-form" id="formRegister" novalidate hidden>
          <label class="auth-field">
            <span class="auth-label">Display name</span>
            <input class="auth-input" type="text" name="name"
                   autocomplete="name" maxlength="60" required>
          </label>

          <label class="auth-field">
            <span class="auth-label">Email</span>
            <input class="auth-input" type="email" name="email"
                   autocomplete="email" spellcheck="false"
                   maxlength="254" required>
          </label>

          <label class="auth-field">
            <span class="auth-label">Password</span>
            <span class="auth-pw">
              <input class="auth-input" type="password" name="password"
                     autocomplete="new-password" maxlength="256" required>
              <button type="button" class="auth-eye" data-eye aria-label="Show password">Show</button>
            </span>
          </label>

          <div class="auth-meter" data-meter data-score="0" aria-hidden="true">
            <i></i><i></i><i></i><i></i>
          </div>
          <p class="auth-hint" data-hint>
            Use 12+ characters with upper and lower case, a number and a symbol.
          </p>

          <label class="auth-field">
            <span class="auth-label">Confirm password</span>
            <input class="auth-input" type="password" name="confirm"
                   autocomplete="new-password" maxlength="256" required>
          </label>

          <label class="auth-check">
            <input type="checkbox" name="terms">
            <span>I agree to the screening-room terms and privacy notice.</span>
          </label>

          <p class="auth-msg" data-msg role="alert" aria-live="polite"></p>

          <button class="btn primary auth-submit" type="submit">Create account</button>

          <p class="auth-foot">
            <button type="button" class="auth-link" data-mode="login">Already a member? Sign in</button>
          </p>
        </form>
      </div>`;

    document.body.appendChild(overlayEl);
    wireModal();
  }

  function setMode(mode) {
    if (!overlayEl) return;
    const isRegister = mode === "register";

    $$(".auth-tab", overlayEl).forEach(t => {
      const on = t.dataset.mode === mode;
      t.classList.toggle("is-on", on);
      t.setAttribute("aria-selected", String(on));
    });

    $("#formLogin", overlayEl).hidden = isRegister;
    $("#formRegister", overlayEl).hidden = !isRegister;

    $("#authHeading", overlayEl).textContent = isRegister ? "Create your account" : "Sign in";
    $(".auth-sub", overlayEl).textContent = isRegister
      ? "One account for your watchlist, history and preferences."
      : "Members sync their watchlist, history and preferences.";

    ["#formLogin", "#formRegister"].forEach(sel => setMsg($(sel, overlayEl), ""));
  }

  function setMsg(form, text, tone) {
    const el = form && form.querySelector("[data-msg]");
    if (!el) return;
    el.textContent = text || "";
    el.dataset.tone = tone || "";
    el.classList.toggle("is-on", !!text);
  }

  function resetForms() {
    if (!overlayEl) return;
    $$("form", overlayEl).forEach(f => { f.reset(); setMsg(f, ""); });
    $$(".auth-pw input", overlayEl).forEach(inp => { inp.type = "password"; });
    $$("[data-eye]", overlayEl).forEach(b => {
      b.textContent = "Show";
      b.setAttribute("aria-label", "Show password");
    });
    const meter = $("[data-meter]", overlayEl);
    if (meter) meter.dataset.score = "0";
  }

  function wireModal() {
    overlayEl.addEventListener("click", e => {
      if (e.target.closest("[data-auth-close]")) { closeAuth(); return; }
      const b = e.target.closest("[data-mode]");
      if (b) {
        e.preventDefault();
        setMode(b.dataset.mode);
        const first = overlayEl.querySelector(".auth-form:not([hidden]) input");
        if (first) first.focus();
        return;
      }
      const eye = e.target.closest("[data-eye]");
      if (eye) {
        const input = eye.parentElement.querySelector("input");
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        eye.textContent = show ? "Hide" : "Show";
        eye.setAttribute("aria-label", show ? "Hide password" : "Show password");
      }
    });

    const regPw = $("#formRegister [name=password]", overlayEl);
    const meter = $("#formRegister [data-meter]", overlayEl);
    regPw.addEventListener("input", () => {
      meter.dataset.score = String(strength(regPw.value));
    });

    $("#formLogin", overlayEl).addEventListener("submit", async e => {
      e.preventDefault();
      const form = e.currentTarget;
      const btn = form.querySelector(".auth-submit");
      const data = Object.fromEntries(new FormData(form).entries());

      setMsg(form, "");
      btn.classList.add("is-busy");
      btn.disabled = true;

      try {
        const user = await login({
          email: data.email,
          password: data.password,
          remember: !!data.remember
        });
        closeAuth();
        renderChip();
        toast(`Welcome back, ${user.name.split(" ")[0]}.`);
      } catch (err) {
        setMsg(form, err.message || "Sign-in failed. Please try again.");
      } finally {
        btn.classList.remove("is-busy");
        btn.disabled = false;
      }
    });

    $("#formRegister", overlayEl).addEventListener("submit", async e => {
      e.preventDefault();
      const form = e.currentTarget;
      const btn = form.querySelector(".auth-submit");
      const data = Object.fromEntries(new FormData(form).entries());

      setMsg(form, "");
      btn.classList.add("is-busy");
      btn.disabled = true;

      try {
        const user = await register({
          name: data.name,
          email: data.email,
          password: data.password,
          confirm: data.confirm,
          terms: !!data.terms
        });
        startSession(user, true); /* auto sign-in after sign-up */
        closeAuth();
        renderChip();
        toast("Account created. Welcome to the archive.");
      } catch (err) {
        setMsg(form, err.message || "Could not create the account.");
      } finally {
        btn.classList.remove("is-busy");
        btn.disabled = false;
      }
    });
  }

  function openAuth(mode) {
    buildModal();
    resetForms();
    setMode(mode === "register" ? "register" : "login");

    const note = $("#authNote", overlayEl);
    if (!secureContextOK()) {
      note.hidden = false;
      note.innerHTML =
        "Accounts need a <strong>secure context</strong>. Open this site over " +
        "<code>https://</code> or <code>http://localhost</code> " +
        "(for example <code>python3 -m http.server</code>) — then reload.";
      $$(".auth-submit", overlayEl).forEach(b => { b.disabled = true; });
    } else {
      note.hidden = true;
      $$(".auth-submit", overlayEl).forEach(b => { b.disabled = false; });
    }

    overlayEl.classList.add("is-open");
    overlayEl.setAttribute("aria-hidden", "false");
    document.body.classList.add("auth-modal-open");

    setTimeout(() => {
      const f = overlayEl.querySelector(".auth-form:not([hidden]) input");
      if (f) f.focus();
    }, 60);
  }

  function closeAuth() {
    if (!overlayEl) return;
    overlayEl.classList.remove("is-open");
    overlayEl.setAttribute("aria-hidden", "true");
    document.body.classList.remove("auth-modal-open");
  }

  /* ---------------------------------------------------------
     SESSION KEEP-ALIVE + AUTO LOGOUT
  --------------------------------------------------------- */
  let lastTouch = 0;

  function touchSession() {
    const now = Date.now();
    if (now - lastTouch < CONFIG.TOUCH_THROTTLE_MS) return;
    lastTouch = now;
    const s = getSession();
    if (!s) return;
    s.lastActive = now;
    writeJSON(s.remember ? localStorage : sessionStorage, K_SESSION, s);
  }

  function watchSession() {
    ["pointerdown", "keydown", "touchstart", "wheel"].forEach(ev =>
      window.addEventListener(ev, touchSession, { passive: true })
    );

    setInterval(() => {
      const alive = !!getSession();
      if (signedIn && !alive) {
        renderChip();
        closePanel();
        toast("Session expired. Please sign in again.");
      }
    }, 30000);
  }

  /* ---------------------------------------------------------
     GLOBAL LISTENERS
  --------------------------------------------------------- */
  document.addEventListener("click", e => {
    if (!panelEl || !panelEl.classList.contains("is-open")) return;
    if (e.target.closest("#authPanel") || e.target.closest("#authChip")) return;
    closePanel();
  });

  window.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    if (overlayEl && overlayEl.classList.contains("is-open")) {
      e.stopPropagation();
      closeAuth();
    } else if (panelEl && panelEl.classList.contains("is-open")) {
      closePanel();
    }
  }, true);

  window.addEventListener("hashchange", () => {
    closePanel();
    guardRoute();
  });

  /* ---------------------------------------------------------
     OPTIONAL ROUTE GUARD
  --------------------------------------------------------- */
  function guardRoute() {
    if (!CONFIG.REQUIRE_FOR.length) return;
    const hash = (location.hash || "").replace(/^#\/?/, "");
    const path = hash.split("?")[0] || "archive";
    if (CONFIG.REQUIRE_FOR.indexOf(path) === -1) return;
    if (currentUser()) return;
    toast("Sign in to open that page.");
    if (location.hash !== "#/archive") location.hash = "#/archive";
    setTimeout(() => openAuth("login"), 220);
  }

  /* ---------------------------------------------------------
     BOOT
  --------------------------------------------------------- */
  function boot() {
    mountChip();
    watchSession();
    guardRoute();
    if (!secureContextOK()) {
      console.warn(
        "[ValeAuth] crypto.subtle unavailable — accounts are disabled.\n" +
        "Serve the site over https:// or http://localhost."
      );
    }
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else
    boot();

  /* ---------------------------------------------------------
     PUBLIC API
  --------------------------------------------------------- */
  window.ValeAuth = {
    register,
    login,
    logout,
    user: currentUser,
    session: getSession,
    open: openAuth,
    close: closeAuth,
    config: CONFIG
  };

})();