(function () {
  "use strict";

  /* ============================================================
     DATA — 22 film & TV titles
  ============================================================ */
  const TITLES = [
    {id:"shawshank",   title:"The Shawshank Redemption", year:1994, type:"movie",  genres:["Drama","Crime"],        runtime:"2h 22m", rating:9.3, age:"R",     country:"USA", director:"Frank Darabont", cast:["Tim Robbins","Morgan Freeman","Bob Gunton","William Sadler"], poster:"https://upload.wikimedia.org/wikipedia/en/8/81/ShawshankRedemptionMoviePoster.jpg", backdrop:"https://upload.wikimedia.org/wikipedia/en/8/81/ShawshankRedemptionMoviePoster.jpg", synopsis:"Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.", related:["godfather","pulpfiction","interstellar"]},
    {id:"godfather",   title:"The Godfather",             year:1972, type:"movie",  genres:["Crime","Drama"],        runtime:"2h 55m", rating:9.2, age:"R",     country:"USA", director:"Francis Ford Coppola", cast:["Marlon Brando","Al Pacino","James Caan","Robert Duvall"], poster:"https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg", backdrop:"https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg", synopsis:"The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.", related:["sopranos","goodfellas","pulpfiction"], tall:true},
    {id:"pulpfiction", title:"Pulp Fiction",              year:1994, type:"movie",  genres:["Crime","Drama"],        runtime:"2h 34m", rating:8.9, age:"R",     country:"USA", director:"Quentin Tarantino",   cast:["John Travolta","Samuel L. Jackson","Uma Thurman","Bruce Willis"], poster:"https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg", backdrop:"https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg", synopsis:"The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.", related:["shawshank","goodfellas","godfather"]},
    {id:"darkknight",  title:"The Dark Knight",           year:2008, type:"movie",  genres:["Action","Crime","Drama"],runtime:"2h 32m", rating:9.0, age:"PG-13", country:"USA", director:"Christopher Nolan",   cast:["Christian Bale","Heath Ledger","Aaron Eckhart","Michael Caine"], poster:"https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg", backdrop:"https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg", synopsis:"When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest psychological tests of his ability to fight injustice.", related:["inception","interstellar","sherlock"]},
    {id:"inception",   title:"Inception",                 year:2010, type:"movie",  genres:["Sci-Fi","Action","Thriller"], runtime:"2h 28m", rating:8.8, age:"PG-13", country:"USA", director:"Christopher Nolan", cast:["Leonardo DiCaprio","Joseph Gordon-Levitt","Elliot Page","Tom Hardy"], poster:"https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg", backdrop:"https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg", synopsis:"A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.", related:["interstellar","darkknight","sherlock"]},
    {id:"interstellar",title:"Interstellar",              year:2014, type:"movie",  genres:["Sci-Fi","Drama"],       runtime:"2h 49m", rating:8.7, age:"PG-13", country:"USA", director:"Christopher Nolan",   cast:["Matthew McConaughey","Anne Hathaway","Jessica Chastain","Michael Caine"], poster:"https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg", backdrop:"https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg", synopsis:"A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", related:["inception","darkknight","stranger"]},
    {id:"goodfellas",  title:"Goodfellas",                year:1990, type:"movie",  genres:["Crime","Drama"],        runtime:"2h 25m", rating:8.7, age:"R",     country:"USA", director:"Martin Scorsese",      cast:["Robert De Niro","Ray Liotta","Joe Pesci","Lorraine Bracco"], poster:"https://upload.wikimedia.org/wikipedia/en/7/7b/Goodfellas.jpg", backdrop:"https://upload.wikimedia.org/wikipedia/en/7/7b/Goodfellas.jpg", synopsis:"The story of Henry Hill and his life in the mob, covering his relationship with his wife and his mob partners.", related:["godfather","sopranos","pulpfiction"]},
    {id:"breakingbad", title:"Breaking Bad",              year:2008, type:"series", genres:["Crime","Drama","Thriller"], runtime:"5 Seasons", rating:9.5, age:"TV-MA", country:"USA", director:"Vince Gilligan", cast:["Bryan Cranston","Aaron Paul","Anna Gunn","Giancarlo Esposito"], poster:"https://static.tvmaze.com/uploads/images/medium_portrait/501/1253519.jpg", backdrop:"https://static.tvmaze.com/uploads/images/original_untouched/501/1253519.jpg", synopsis:"A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.", related:["bettercallsaul","wire","sopranos"],
      seasons:[{number:1, episodes:[
        {n:1,title:"Pilot",runtime:"58m",syn:"A chemistry teacher receives a devastating diagnosis and makes a fateful decision."},
        {n:2,title:"Cat's in the Bag...",runtime:"48m",syn:"Walt and Jesse try to decide what to do with a problem in the RV."},
        {n:3,title:"...And the Bag's in the River",runtime:"48m",syn:"Walt struggles with a moral dilemma while Jesse deals with a personal crisis."},
        {n:4,title:"Cancer Man",runtime:"48m",syn:"Walt's secret life strains his marriage and his relationship with his son."},
        {n:5,title:"Gray Matter",runtime:"48m",syn:"Walt considers an old offer while Jesse spirals further from his family."}
      ]}]},
    {id:"got",         title:"Game of Thrones",           year:2011, type:"series", genres:["Fantasy","Drama","Adventure"], runtime:"8 Seasons", rating:9.2, age:"TV-MA", country:"USA", director:"David Benioff, D.B. Weiss", cast:["Emilia Clarke","Peter Dinklage","Kit Harington","Lena Headey"], poster:"https://static.tvmaze.com/uploads/images/medium_portrait/498/1245274.jpg", backdrop:"https://static.tvmaze.com/uploads/images/original_untouched/498/1245274.jpg", synopsis:"Nine noble families fight for control over the lands of Westeros while an ancient enemy returns after being dormant for a millennium.", related:["stranger","peaky","sherlock"],
      seasons:[{number:1, episodes:[
        {n:1,title:"Winter Is Coming",runtime:"1h 2m",syn:"The Starks of Winterfell receive an unexpected royal visit."},
        {n:2,title:"The Kingsroad",runtime:"56m",syn:"The king's entourage heads south while Jon Snow chooses his path."},
        {n:3,title:"Lord Snow",runtime:"58m",syn:"Ned confronts the realities of King's Landing."},
        {n:4,title:"Cripples, Bastards, and Broken Things",runtime:"56m",syn:"Ned searches for answers about Jon Arryn's death."},
        {n:5,title:"The Wolf and the Lion",runtime:"55m",syn:"A tense confrontation changes the balance of power."}
      ]}]},
    {id:"stranger",    title:"Stranger Things",           year:2016, type:"series", genres:["Sci-Fi","Horror","Drama"], runtime:"4 Seasons", rating:8.7, age:"TV-14", country:"USA", director:"The Duffer Brothers", cast:["Millie Bobby Brown","Finn Wolfhard","Winona Ryder","David Harbour"], poster:"https://static.tvmaze.com/uploads/images/medium_portrait/595/1489169.jpg", backdrop:"https://static.tvmaze.com/uploads/images/original_untouched/595/1489169.jpg", synopsis:"When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.", related:["darkknight","got","inception"]},
    {id:"wire",        title:"The Wire",                  year:2002, type:"series", genres:["Crime","Drama"],        runtime:"5 Seasons", rating:9.3, age:"TV-MA", country:"USA", director:"David Simon",         cast:["Dominic West","Idris Elba","Michael K. Williams","Wendell Pierce"], poster:"https://static.tvmaze.com/uploads/images/medium_portrait/504/1260189.jpg", backdrop:"https://static.tvmaze.com/uploads/images/original_untouched/504/1260189.jpg", synopsis:"The Baltimore drug scene, as seen through the eyes of drug dealers and law enforcement.", related:["sopranos","breakingbad","goodfellas"]},
    {id:"sopranos",    title:"The Sopranos",              year:1999, type:"series", genres:["Crime","Drama"],        runtime:"6 Seasons", rating:9.2, age:"TV-MA", country:"USA", director:"David Chase",         cast:["James Gandolfini","Edie Falco","Michael Imperioli","Lorraine Bracco"], poster:"https://static.tvmaze.com/uploads/images/medium_portrait/4/11341.jpg", backdrop:"https://static.tvmaze.com/uploads/images/original_untouched/4/11341.jpg", synopsis:"New Jersey mob boss Tony Soprano deals with personal and professional issues in his home and business life.", related:["godfather","wire","breakingbad"]},
    {id:"chernobyl",   title:"Chernobyl",                 year:2019, type:"series", genres:["Drama","History","Thriller"], runtime:"1 Season", rating:9.4, age:"TV-MA", country:"USA", director:"Craig Mazin", cast:["Jared Harris","Stellan Skarsgård","Emily Watson","Paul Ritter"], poster:"https://static.tvmaze.com/uploads/images/medium_portrait/193/482599.jpg", backdrop:"https://static.tvmaze.com/uploads/images/original_untouched/193/482599.jpg", synopsis:"In April 1986, an explosion at the Chernobyl nuclear power plant becomes one of the world's worst man-made catastrophes.", related:["wire","breakingbad","lastofus"]},
    {id:"lastofus",    title:"The Last of Us",            year:2023, type:"series", genres:["Drama","Horror","Adventure"], runtime:"2 Seasons", rating:8.8, age:"TV-MA", country:"USA", director:"Craig Mazin, Neil Druckmann", cast:["Pedro Pascal","Bella Ramsey","Anna Torv","Gabriel Luna"], poster:"https://static.tvmaze.com/uploads/images/medium_portrait/563/1409008.jpg", backdrop:"https://static.tvmaze.com/uploads/images/original_untouched/563/1409008.jpg", synopsis:"Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie out of an oppressive quarantine zone.", related:["stranger","got","chernobyl"]},
    {id:"succession",  title:"Succession",                year:2018, type:"series", genres:["Drama"],               runtime:"4 Seasons", rating:8.9, age:"TV-MA", country:"USA", director:"Jesse Armstrong",      cast:["Brian Cox","Jeremy Strong","Sarah Snook","Kieran Culkin"], poster:"https://static.tvmaze.com/uploads/images/medium_portrait/453/1134275.jpg", backdrop:"https://static.tvmaze.com/uploads/images/original_untouched/453/1134275.jpg", synopsis:"The Roy family is known for controlling the biggest media and entertainment company in the world. Their world changes when their father steps down.", related:["madmen","wire","sopranos"]},
    {id:"bettercallsaul", title:"Better Call Saul",       year:2015, type:"series", genres:["Crime","Drama"],        runtime:"6 Seasons", rating:9.0, age:"TV-MA", country:"USA", director:"Vince Gilligan, Peter Gould", cast:["Bob Odenkirk","Rhea Seehorn","Jonathan Banks","Giancarlo Esposito"], poster:"https://static.tvmaze.com/uploads/images/medium_portrait/501/1253515.jpg", backdrop:"https://static.tvmaze.com/uploads/images/original_untouched/501/1253515.jpg", synopsis:"The trials and tribulations of criminal lawyer Jimmy McGill in the years leading up to his fateful run-in with Walter White and Jesse Pinkman.", related:["breakingbad","wire","sopranos"]},
    {id:"peaky",       title:"Peaky Blinders",            year:2013, type:"series", genres:["Crime","Drama"],        runtime:"6 Seasons", rating:8.8, age:"TV-MA", country:"UK",  director:"Steven Knight",       cast:["Cillian Murphy","Tom Hardy","Helen McCrory","Paul Anderson"], poster:"https://static.tvmaze.com/uploads/images/medium_portrait/48/122213.jpg", backdrop:"https://static.tvmaze.com/uploads/images/original_untouched/48/122213.jpg", synopsis:"A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps.", related:["sopranos","wire","goodfellas"]},
    {id:"sherlock",    title:"Sherlock",                  year:2010, type:"series", genres:["Mystery","Crime","Drama"], runtime:"4 Seasons", rating:9.1, age:"TV-14", country:"UK", director:"Mark Gatiss, Steven Moffat", cast:["Benedict Cumberbatch","Martin Freeman","Una Stubbs","Rupert Graves"], poster:"https://static.tvmaze.com/uploads/images/medium_portrait/171/428042.jpg", backdrop:"https://static.tvmaze.com/uploads/images/original_untouched/171/428042.jpg", synopsis:"A modern update finds the famous sleuth and his doctor partner solving crime in 21st century London.", related:["darkknight","peaky","got"]},
    {id:"office",      title:"The Office",                year:2005, type:"series", genres:["Comedy"],              runtime:"9 Seasons", rating:9.0, age:"TV-14", country:"USA", director:"Greg Daniels",        cast:["Steve Carell","Rainn Wilson","John Krasinski","Jenna Fischer"], poster:"https://static.tvmaze.com/uploads/images/medium_portrait/481/1204342.jpg", backdrop:"https://static.tvmaze.com/uploads/images/original_untouched/481/1204342.jpg", synopsis:"A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.", related:["friends","madmen","succession"]},
    {id:"friends",     title:"Friends",                   year:1994, type:"series", genres:["Comedy","Romance"],    runtime:"10 Seasons", rating:8.9, age:"TV-14", country:"USA", director:"David Crane, Marta Kauffman", cast:["Jennifer Aniston","Courteney Cox","Lisa Kudrow","Matt LeBlanc"], poster:"https://static.tvmaze.com/uploads/images/medium_portrait/41/104565.jpg", backdrop:"https://static.tvmaze.com/uploads/images/original_untouched/41/104565.jpg", synopsis:"Follows the personal and professional lives of six twenty-to-thirty-year-old friends living in Manhattan.", related:["office","madmen","succession"]},
    {id:"madmen",      title:"Mad Men",                   year:2007, type:"series", genres:["Drama"],               runtime:"7 Seasons", rating:8.7, age:"TV-14", country:"USA", director:"Matthew Weiner",      cast:["Jon Hamm","Elisabeth Moss","Vincent Kartheiser","January Jones"], poster:"https://static.tvmaze.com/uploads/images/medium_portrait/2/5589.jpg", backdrop:"https://static.tvmaze.com/uploads/images/original_untouched/2/5589.jpg", synopsis:"A drama about one of New York's most prestigious ad agencies at the beginning of the 1960s.", related:["succession","sopranos","office"]}
  ];

  /* ============================================================
     UTILS
  ============================================================ */
  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s).replace(/[<>&"']/g, c => ({ "<":"&lt;",">":"&gt;","&":"&amp;","\"":"&quot;","'":"&#39;" }[c]));
  const find = id => TITLES.find(t => t.id === id) || null;
  const genres = () => Array.from(new Set(TITLES.flatMap(t => t.genres))).sort();

  const KEY_WATCH = "vale.watchlist.v1";
  const KEY_HIST  = "vale.history.v1";
  const watchlist = {
    get() { try { return JSON.parse(localStorage.getItem(KEY_WATCH) || "[]"); } catch (_) { return []; } },
    has(id) { return this.get().indexOf(id) >= 0; },
    toggle(id) {
      const cur = this.get();
      const i = cur.indexOf(id);
      if (i >= 0) cur.splice(i, 1); else cur.unshift(id);
      localStorage.setItem(KEY_WATCH, JSON.stringify(cur));
      return i < 0;
    }
  };
  const history = {
    get() { try { return JSON.parse(localStorage.getItem(KEY_HIST) || "[]"); } catch (_) { return []; } },
    push(id) {
      const cur = this.get().filter(x => x !== id);
      cur.unshift(id);
      localStorage.setItem(KEY_HIST, JSON.stringify(cur.slice(0, 30)));
    }
  };

  let toastEl = null, toastTimer = null;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "vale-toast"; document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    requestAnimationFrame(() => toastEl.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
  }

  function fallbackImg(title) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900"><rect width="600" height="900" fill="#0b0b0b"/><text x="50%" y="50%" fill="#8c8783" font-family="Georgia,serif" font-size="26" text-anchor="middle">${esc(title)}</text></svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  function posterCardHTML(t) {
    return `
      <a class="poster-card" href="#/detail?id=${t.id}">
        <img src="${t.poster}" alt="${esc(t.title)}" loading="lazy" onerror="this.src='${fallbackImg(t.title)}'">
        <div class="badge">${t.type === "series" ? "Series" : "Film"}</div>
        <div class="rating-badge">★ ${t.rating.toFixed(1)}</div>
        <div class="overlay"><h3>${esc(t.title)}</h3><p>${t.year} · ${esc(t.genres[0])}</p></div>
      </a>`;
  }

  /* ============================================================
     GLOBAL UI: sidebar menu, cursor, header scroll
  ============================================================ */
  (function initSidebarMenu() {
    const navToggle = document.getElementById("navToggle");
    if (!navToggle) return;

    const syncLock = () => {
      document.body.classList.toggle("nav-open", navToggle.checked);
    };
    navToggle.addEventListener("change", syncLock);
    syncLock();

    document.querySelectorAll(".sidebar ul a").forEach(a => {
      a.addEventListener("click", () => { navToggle.checked = false; });
    });

    window.addEventListener("keydown", e => {
      if (e.key === "Escape" && navToggle.checked) navToggle.checked = false;
    });

    window.addEventListener("hashchange", () => { navToggle.checked = false; });
  })();

  // custom cursor
  const isCoarse = matchMedia("(pointer: coarse)").matches;
  const dot = $("#dot");
  if (!isCoarse && dot && matchMedia("(hover: hover)").matches) {
    let mx = -100, my = -100, cx = -100, cy = -100;
    window.addEventListener("pointermove", e => {
      mx = e.clientX; my = e.clientY;
      if (e.target.closest("a,button,.poster-card,.card,#grid figure,.episode,.suggestion,.chip")) dot.classList.add("wide");
      else dot.classList.remove("wide");
    }, { passive: true });
    (function loop() { cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2; dot.style.transform = `translate3d(${cx}px, ${cy}px, 0)`; requestAnimationFrame(loop); })();
  }

  // header scrolled state
  const header = $(".site-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) header.classList.add("scrolled"); else header.classList.remove("scrolled");
  }, { passive: true });

  /* ============================================================
     ROUTER
  ============================================================ */
  function parseHash() {
    let h = (location.hash || "").replace(/^#\/?/, "");
    if (!h) h = "archive";
    const qIdx = h.indexOf("?");
    return { path: qIdx >= 0 ? h.slice(0, qIdx) : h, params: new URLSearchParams(qIdx >= 0 ? h.slice(qIdx + 1) : "") };
  }

  let archiveInited = false;
  let homeInited = false;
  let searchInited = false;
  let profileInited = false;

  function showView(name, params) {
    const prev = document.body.dataset.view;

    // leaving player: pause video
    if (prev === "player" && name !== "player") { const v = $("#view-player video"); if (v) v.pause(); }
    // leaving archive: cleanup transient classes
    if (prev === "archive" && name !== "archive") document.body.classList.remove("gridview", "lit", "deep");
    // leaving detail: close trailer
    if (prev === "detail" && name !== "detail") { const m = $("#trailerModal"); if (m) { m.classList.remove("open"); const v = $("#trailerVideo"); if (v) v.pause(); } }

    // reset global state
    document.documentElement.style.overflow = "";
    document.body.classList.remove("locked");

    // activate view
    $$(".view").forEach(v => v.classList.toggle("active", v.dataset.view === name));
    document.body.dataset.view = name;
    window.scrollTo(0, 0);

    // init target
    if (name === "archive") {
      if (!archiveInited) initArchive();
      else { if (!document.body.classList.contains("revealed")) document.body.classList.add("revealed"); layoutSphere(true); }
    } else if (name === "home") { initHome(); }
    else if (name === "detail") { initDetail(params); }
    else if (name === "player") { initPlayer(params); }
    else if (name === "search") { initSearch(params); }
    else if (name === "profile") { initProfile(); }
    else { // unknown route -> home
      location.hash = "#/home";
    }
  }

  window.addEventListener("hashchange", () => { const { path, params } = parseHash(); showView(path, params); });

  /* ============================================================
     ARCHIVE (page 2) — splash, film, sphere, grid, lightbox
  ============================================================ */
  const DATA = TITLES;
  const N = DATA.length;
  const GA = Math.PI * (3 - Math.sqrt(5));

  let R = 300, perspective = 1150;
  let cardEls = [], cardUnits = [];
  let currentShot = -1, focusedCard = null;
  let spin = 0, tilt = -4, camZ = 0, dragX = 0, dragY = 0, velX = 0, velY = 0;
  const PITCH_LIMIT = 32;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function layoutSphere(force) {
    const w = window.innerWidth, h = window.innerHeight;
    if (!force && Math.abs(w - (layoutSphere._w || 0)) < 20 && Math.abs(h - (layoutSphere._h || 0)) < 20) return;
    layoutSphere._w = w; layoutSphere._h = h;
    let hr, wr, floor, scale;
    if (w <= 380) { hr = 0.38; wr = 0.48; floor = 108; scale = 0.44; perspective = 620; }
    else if (w <= 640) { hr = 0.42; wr = 0.52; floor = 120; scale = 0.46; perspective = 760; }
    else if (w <= 900) { hr = 0.46; wr = 0.58; floor = 155; scale = 0.47; perspective = 920; }
    else { hr = 0.46; wr = 0.58; floor = 155; scale = 0.47; perspective = 1150; }
    R = Math.max(floor, Math.min(480, h * hr, w * wr));
    const cw = Math.round(Math.max(72, R * scale));
    document.documentElement.style.setProperty("--persp", perspective + "px");
    cardEls.forEach((card, i) => {
      const u = cardUnits[i];
      const px = u.x * R, py = -u.y * R, pz = u.z * R;
      const isTall = !!DATA[i].tall;
      card.style.width = cw + "px";
      card.style.height = (isTall ? cw * 1.25 : cw / 1.5) + "px";
      card.style.marginLeft = (-cw / 2) + "px";
      card.style.marginTop = (isTall ? cw * -0.625 : -cw / 3) + "px";
      card.style.transform = `translate3d(${px}px, ${py}px, ${pz}px) rotateY(${u.lon}deg) rotateX(${u.lat}deg)`;
    });
  }

  function buildArchiveCards() {
    const orb = $("#orb"), rows = $("#grid .rows");
    for (let i = 0; i < N; i++) {
      const item = DATA[i];
      const y = 1 - (i / (N - 1)) * 2;
      const rad = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = i * GA;
      const x = Math.cos(theta) * rad, z = Math.sin(theta) * rad;
      const lat = Math.asin(y) * 180 / Math.PI;
      const lon = Math.atan2(x, z) * 180 / Math.PI;
      const card = document.createElement("div");
      card.className = "card" + (item.tall ? " tall" : "");
      card.dataset.idx = String(i);
      const fig = document.createElement("figure");
      const img = document.createElement("img");
      img.alt = item.title; img.loading = i > 6 ? "lazy" : "eager"; img.src = item.poster;
      img.addEventListener("load", () => img.classList.add("in"));
      img.addEventListener("error", () => { img.src = fallbackImg(item.title); img.classList.add("in"); });
      fig.appendChild(img); card.appendChild(fig);
      orb.appendChild(card);
      cardEls.push(card); cardUnits.push({ x, y, z, lat, lon });

      // grid item
      const gfig = document.createElement("figure");
      gfig.dataset.idx = String(i);
      const gimg = document.createElement("img");
      gimg.alt = item.title; gimg.loading = "lazy"; gimg.src = item.poster;
      gimg.addEventListener("error", () => { gimg.src = fallbackImg(item.title); });
      const cap = document.createElement("figcaption");
      cap.textContent = item.title;
      gfig.appendChild(gimg); gfig.appendChild(cap);
      gfig.addEventListener("click", () => openShot(i, gfig));
      rows.appendChild(gfig);
    }
  }

  // drag state
  const dragState = { active:false, pointerId:null, startX:0, startY:0, lastX:0, lastY:0, totalX:0, totalY:0, touchCandidate:false, cardAtDown:null, captured:false };

  function bindArchiveControls() {
    const stage = $("#stage");
    if (!stage) return;

    // grid toggle
    $("#gridBtn").addEventListener("click", () => {
      document.body.classList.toggle("gridview");
      if (document.body.classList.contains("gridview")) document.body.classList.remove("deep");
    });

    // pointer drag on stage
    stage.addEventListener("pointerdown", e => {
      if (currentShot >= 0) return;
      dragState.cardAtDown = e.target.closest(".card") || null;
      dragState.pointerId = e.pointerId;
      dragState.startX = dragState.lastX = e.clientX;
      dragState.startY = dragState.lastY = e.clientY;
      dragState.totalX = dragState.totalY = 0;
      dragState.active = false;
      dragState.touchCandidate = e.pointerType === "touch";
      if (e.pointerType === "mouse" || e.pointerType === "pen") {
        dragState.active = true;
        try { stage.setPointerCapture(e.pointerId); } catch (_) {}
        e.preventDefault();
      }
    }, { passive: false });

    stage.addEventListener("pointermove", e => {
      if (e.pointerId !== dragState.pointerId) return;
      if (!dragState.active && dragState.touchCandidate) {
        const dx = e.clientX - dragState.startX, dy = e.clientY - dragState.startY;
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
        if (Math.abs(dy) > Math.abs(dx) * 1.15) { dragState.pointerId = null; dragState.touchCandidate = false; dragState.cardAtDown = null; return; }
        dragState.active = true;
        try { stage.setPointerCapture(e.pointerId); } catch (_) {}
      }
      if (!dragState.active) return;
      const dx = e.clientX - dragState.lastX, dy = e.clientY - dragState.lastY;
      dragState.lastX = e.clientX; dragState.lastY = e.clientY;
      dragState.totalX += dx; dragState.totalY += dy;
      dragX += dx * 0.13; dragY += dy * 0.13;
      velX = dx * 0.13 * 0.6; velY = dy * 0.13 * 0.6;
      dragY = clamp(dragY, -PITCH_LIMIT - tilt, PITCH_LIMIT - tilt);
      if (e.pointerType !== "touch") e.preventDefault();
    }, { passive: false });

    function endDrag(e) {
      if (e.pointerId !== dragState.pointerId) return;
      const slop = isCoarse ? 14 : 6;
      const wasDrag = Math.abs(dragState.totalX) > slop || Math.abs(dragState.totalY) > slop;
      const card = dragState.cardAtDown;
      if (!wasDrag && card && currentShot < 0) {
        const idx = parseInt(card.dataset.idx, 10);
        if (!isNaN(idx)) openShot(idx, card.querySelector("figure"));
      }
      dragState.active = false; dragState.pointerId = null;
      dragState.touchCandidate = false; dragState.cardAtDown = null;
    }
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);

    // scroll progress: deep class + clamp
    window.addEventListener("scroll", () => {
      if (document.body.dataset.view !== "archive") return;
      const p = window.scrollY / (window.innerHeight * 0.16 || 1);
      if (p > 0.08 && currentShot < 0) document.body.classList.add("deep");
      else document.body.classList.remove("deep");
      const max = window.innerHeight * 0.16;
      if (window.scrollY > max) window.scrollTo(0, max);
    }, { passive: true });

    // resize
    let rt = null;
    window.addEventListener("resize", () => layoutSphere(true));
    window.addEventListener("orientationchange", () => { clearTimeout(rt); rt = setTimeout(() => layoutSphere(true), 220); });

    // lightbox close
    document.querySelectorAll("#lit [data-close]").forEach(el => el.addEventListener("click", e => { e.stopPropagation(); closeShot(); }));
    $("#lit").addEventListener("click", e => { if (e.target.id === "lit" || e.target.classList.contains("scrim")) closeShot(); });
    window.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        if (document.body.classList.contains("lit")) closeShot();
        else if (document.body.classList.contains("gridview")) document.body.classList.remove("gridview");
      }
    });
  }

  function openShot(idx, sourceEl) {
    const item = DATA[idx];
    if (!item) return;
    currentShot = idx;
    focusedCard = cardEls[idx] || null;
    if (focusedCard) focusedCard.style.opacity = "0";
    $("#litTitle").textContent = item.title;
    $("#litWhere").textContent = `${item.year} · ${item.genres.join(" · ")}`;
    $("#litNote").textContent = item.synopsis;
    $("#litCta").href = "#/detail?id=" + item.id;
    $("#litImg").src = item.poster;
    document.body.classList.add("lit");
    document.documentElement.style.overflow = "hidden";

    const plate = $("#plate");
    const src = sourceEl || document.querySelector(`.card[data-idx="${idx}"] figure`) || document.querySelector(`#grid figure[data-idx="${idx}"]`);
    if (!src) return;
    const sr = src.getBoundingClientRect();
    const tr = plate.getBoundingClientRect();
    const dx = (sr.left + sr.width / 2) - (tr.left + tr.width / 2);
    const dy = (sr.top + sr.height / 2) - (tr.top + tr.height / 2);
    const scale = Math.max(0.04, sr.width / tr.width);
    plate.style.transition = "none";
    plate.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
    plate.style.opacity = "0";
    void plate.offsetHeight;
    plate.style.transition = ""; plate.style.transform = ""; plate.style.opacity = "";
  }

  function closeShot() {
    if (currentShot < 0) return;
    const idx = currentShot;
    const src = document.querySelector(`.card[data-idx="${idx}"] figure`) || document.querySelector(`#grid figure[data-idx="${idx}"]`);
    const plate = $("#plate");
    if (focusedCard) { focusedCard.style.opacity = ""; focusedCard = null; }
    if (src) {
      const sr = src.getBoundingClientRect();
      const tr = plate.getBoundingClientRect();
      const dx = (sr.left + sr.width / 2) - (tr.left + tr.width / 2);
      const dy = (sr.top + sr.height / 2) - (tr.top + tr.height / 2);
      const scale = Math.max(0.04, sr.width / tr.width);
      plate.style.transition = "none";
      plate.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
      plate.style.opacity = "0";
    }
    currentShot = -1;
    document.body.classList.remove("lit");
    document.documentElement.style.overflow = "";
    setTimeout(() => {
      if (document.body.classList.contains("lit")) return;
      plate.style.transition = "none";
      plate.style.transform = ""; plate.style.opacity = "";
      requestAnimationFrame(() => { plate.style.transition = ""; });
    }, 640);
  }

  // camera loop
  function frame() {
    requestAnimationFrame(frame);
    if (document.body.dataset.view !== "archive") return;
    const world = $("#world"), headline = $("#headline");
    if (!world || !headline) return;

    const p = clamp(window.scrollY / (window.innerHeight * 0.16 || 1), 0, 1);
    if (!dragState.active && currentShot < 0) {
      dragX += velX; dragY += velY;
      velX *= 0.94; velY *= 0.94;
      if (Math.abs(velX) < 0.002) velX = 0;
      if (Math.abs(velY) < 0.002) velY = 0;
      dragY = clamp(dragY, -PITCH_LIMIT - tilt, PITCH_LIMIT - tilt);
    }
    const camZTarget = p * Math.min(64, R * 0.12);
    camZ += (camZTarget - camZ) * 0.075;
    const sx = tilt + dragY, sy = spin + dragX;
    world.style.transform = `translateZ(${camZ}px) rotateY(${sy}deg) rotateX(${sx}deg)`;
    headline.style.transform = `rotateX(${-sx}deg) rotateY(${-sy}deg) translateZ(${(R * 0.62)}px)`;
    headline.style.opacity = String(Math.max(0, 1 - p * 0.55));

    const cy = Math.cos(sy * Math.PI / 180), syr = Math.sin(sy * Math.PI / 180);
    const cx = Math.cos(sx * Math.PI / 180), sxr = Math.sin(sx * Math.PI / 180);
    const near = perspective * 0.66;
    const shade = 1 - Math.min(1, p * 1.6);
    const isLit = currentShot >= 0;
    for (let i = 0; i < cardEls.length; i++) {
      const u = cardUnits[i];
      const x1 = u.x * cy + u.z * syr;
      const z1 = -u.x * syr + u.z * cy;
      const z2 = z1 * cx + u.y * sxr;
      const zf = clamp(z2, -1, 1);
      const base = 0.14 + 0.86 * Math.pow((zf + 1) / 2, 0.85);
      let dim = shade * (1 - base);
      if (isLit) dim = Math.min(1, dim + 0.78);
      const absZ = zf * R + camZ;
      let fade = 1;
      if (absZ > near) fade = Math.max(0, 1 - (absZ - near) / 190);
      if (isLit && i === currentShot) fade = 0;
      const card = cardEls[i];
      if (card._fade !== fade) { card.style.opacity = String(fade); card._fade = fade; }
      const dVal = dim.toFixed(3);
      if (card._d !== dVal) { card.style.setProperty("--d", dVal); card._d = dVal; }
    }
  }

  function initArchive() {
    archiveInited = true;
    document.body.classList.add("locked");
    buildArchiveCards();
    bindArchiveControls();
    layoutSphere(true);

    const splash = $("#splash");
    const intro  = $("#intro");
    const film   = $("#film");
    const bar    = $("#bar");
    const skip   = $("#skip");

    // ---- splash progress ----
    let loaded = 0;
    const total = DATA.length + 1;
    const startedAt = performance.now();
    let splashDone = false;
    function mark() {
      loaded++;
      if (bar) bar.style.transform = `scaleX(${Math.min(1, loaded / total)})`;
      tryFinish();
    }
    DATA.forEach(item => { const im = new Image(); im.onload = mark; im.onerror = mark; im.src = item.poster; });
    film.addEventListener("loadeddata", mark, { once: true });
    film.addEventListener("canplay",    mark, { once: true });
    film.addEventListener("error", () => { mark(); intro.classList.add("novideo"); setTimeout(reveal, 1300); }, { once: true });
    setTimeout(mark, 2500);
    function tryFinish() {
      if (splashDone) return;
      const elapsed = performance.now() - startedAt;
      if ((loaded >= total && elapsed >= 1150) || elapsed >= 9000) {
        splashDone = true;
        if (bar) bar.style.transform = "scaleX(1)";
        setTimeout(() => {
          splash.classList.add("out");
          startFilm();
          setTimeout(() => { if (splash.parentNode) splash.parentNode.removeChild(splash); }, 950);
        }, 320);
      }
    }
    setTimeout(tryFinish, 9200);

    // ---- intro film ----
    let filmStarted = false, revealed = false, filmTimer = null;
    function startFilm() {
      if (filmStarted) return;
      filmStarted = true;
      document.documentElement.style.overflow = "hidden";
      film.muted = true; film.defaultMuted = true; film.playsInline = true;
      film.setAttribute("webkit-playsinline", "");
      film.playbackRate = 2;
      if (film.currentTime > 0.05) film.currentTime = 0;
      const pp = film.play();
      if (pp && pp.catch) pp.catch(() => { intro.classList.add("novideo"); setTimeout(reveal, 1300); });
      film.addEventListener("playing", () => { film.playbackRate = 2; scheduleFilmReveal(); }, { once: true });
      film.addEventListener("ended", reveal, { once: true });
      setTimeout(() => { if (film.paused && !revealed) { intro.classList.add("novideo"); reveal(); } }, 2600);
      setTimeout(() => { if (!revealed) reveal(); }, 14000);
    }
    function scheduleFilmReveal() {
      if (filmTimer) clearTimeout(filmTimer);
      const d = isFinite(film.duration) ? film.duration : 0;
      if (!d) return;
      const remaining = d - film.currentTime - 0.45;
      filmTimer = setTimeout(reveal, Math.max(300, (remaining / 2) * 1000));
    }
    function reveal() {
      if (revealed) return;
      revealed = true;
      if (intro) intro.classList.add("closing");
      document.body.classList.remove("locked");
      document.documentElement.style.overflow = "";
      layoutSphere(true);
      requestAnimationFrame(() => layoutSphere(true));
      setTimeout(() => {
        layoutSphere(true);
        document.body.classList.add("revealed");
        if (intro) intro.classList.add("gone");
        setTimeout(() => { if (intro && intro.parentNode) intro.parentNode.removeChild(intro); }, 700);
      }, 1000);
    }
    if (skip) skip.addEventListener("click", reveal);

    // autoplay unlock on first interaction
    ["pointerdown", "keydown", "touchstart"].forEach(ev => window.addEventListener(ev, () => {
      if (filmStarted && film.paused && !revealed) film.play().catch(() => {});
    }, { once: true, passive: true }));

    requestAnimationFrame(frame);
  }

  /* ============================================================
     HOME
  ============================================================ */
  function initHome() {
    const hero = $("#hero");
    if (!hero) return;
    if (!homeInited) {
      homeInited = true;
      const featured = find("darkknight") || TITLES[0];
      const floatA = find("inception") || TITLES[1];
      const floatB = find("interstellar") || TITLES[2];
      const floatC = find("got") || TITLES[3];
      hero.innerHTML = `
        <div class="hero-bg" style="background-image:url('${featured.backdrop}')"></div>
        <div class="hero-grad"></div>
        <div class="hero-noise" aria-hidden="true"></div>
        <div class="hero-inner hero-3d-inner">
          <div class="hero-copy hero-reveal">
            <div class="eyebrow"><span class="live-dot"></span> CINEVIBE ORIGINAL EXPERIENCE</div>
            <div class="hero-kicker">Stories that stay with you.</div>
            <h1>${esc(featured.title)}<span class="hero-title-glow">.</span></h1>
            <div class="meta-line"><span>${featured.year}</span><span>${featured.runtime}</span><span>${featured.age}</span><span class="rating">★ ${featured.rating.toFixed(1)}</span></div>
            <p class="syn">${esc(featured.synopsis)}</p>
            <div class="actions">
              <a class="btn primary hero-cta" href="#/detail?id=${featured.id}"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Explore film</a>
              <a class="btn hero-secondary" href="#/archive">Enter the archive <span aria-hidden="true">↗</span></a>
            </div>
            <div class="hero-footnote"><span class="hero-line"></span> YOUR NEXT FAVOURITE STORY STARTS HERE</div>
          </div>
          <div class="hero-stage-3d" aria-label="Featured movie posters">
            <div class="hero-orbit orbit-one"></div><div class="hero-orbit orbit-two"></div>
            <div class="floating-poster poster-back poster-back-left"><img src="${floatA.poster}" alt="${esc(floatA.title)}"><span>${esc(floatA.title)}</span></div>
            <div class="floating-poster poster-back poster-back-right"><img src="${floatB.poster}" alt="${esc(floatB.title)}"><span>${esc(floatB.title)}</span></div>
            <div class="floating-poster poster-back poster-back-top"><img src="${floatC.poster}" alt="${esc(floatC.title)}"><span>${esc(floatC.title)}</span></div>
            <div class="hero-poster hero-poster-main"><img src="${featured.poster}" alt="${esc(featured.title)}"><div class="poster-glass"></div><div class="poster-label"><span>FEATURED FILM</span><b>${esc(featured.title)}</b></div></div>
            <div class="hero-float-badge badge-rating"><span>★</span><div><b>${featured.rating.toFixed(1)} / 10</b><small>CRITIC SCORE</small></div></div>
            <div class="hero-float-badge badge-cinema"><i class="fas fa-film"></i><div><b>Now showing</b><small>CURATED FOR YOU</small></div></div>
          </div>
        </div>
        <div class="hero-scroll-cue"><span></span> SCROLL TO DISCOVER</div>`;
      $("#row-now").innerHTML    = TITLES.filter(t => t.type === "movie").slice(0, 10).map(posterCardHTML).join("");
      $("#row-series").innerHTML = TITLES.filter(t => t.type === "series").slice(0, 10).map(posterCardHTML).join("");
      $("#row-modern").innerHTML = TITLES.filter(t => t.year >= 2000).sort((a, b) => b.rating - a.rating).slice(0, 10).map(posterCardHTML).join("");
      $("#genre-row").innerHTML  = genres().map(g => `<a class="chip" href="#/search?genre=${encodeURIComponent(g)}">${esc(g)}</a>`).join("");
    }
  }

  /* ============================================================
     DETAIL
  ============================================================ */
  function initDetail(params) {
    const id = params.get("id") || "shawshank";
    const t = find(id) || TITLES[0];
    document.title = t.title + " — Ethan Vale";

    const main = $("#detailMain");
    main.innerHTML = `
      <section class="detail-hero">
        <div class="detail-bg" style="background-image:url('${t.backdrop}')"></div>
        <div class="detail-grad"></div>
        <div class="detail-top">
          <div class="detail-poster"><img src="${t.poster}" alt="${esc(t.title)}"></div>
          <div class="detail-copy">
            <div class="eyebrow">${t.type === "series" ? "Television Series" : "Feature Film"} · ${esc(t.country)}</div>
            <h1>${esc(t.title)}</h1>
            <div class="meta-line"><span>${t.year}</span><span>${t.runtime}</span><span>${t.age}</span><span class="rating">★ ${t.rating.toFixed(1)}</span></div>
            <div class="pills">${t.genres.map(g => `<a class="pill" href="#/search?genre=${encodeURIComponent(g)}">${esc(g)}</a>`).join("")}</div>
            <div class="actions">
              <a class="btn primary" href="#/player?id=${t.id}"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Play</a>
              <button class="btn ghost" id="trailerBtn">Watch Trailer</button>
              <button class="watch-btn" id="watchBtn"></button>
            </div>
          </div>
        </div>
      </section>

      <section class="detail-body">
        <div>
          <section class="section"><h2>Synopsis</h2><p class="syn">${esc(t.synopsis)}</p></section>
          <section class="section"><h2>Trailer</h2>
            <div class="trailer-card" id="trailerCard"><img src="${t.backdrop}" alt=""><div class="trailer-play"></div></div>
          </section>
          <section class="section"><h2>Cast</h2>
            <div class="cast-strip">${t.cast.map(c => {
              const init = c.split(" ").map(w => w[0]).slice(0, 2).join("");
              return `<div class="cast-item"><div class="cast-avatar">${esc(init)}</div><div class="cname">${esc(c)}</div><div class="crole">Cast</div></div>`;
            }).join("")}</div>
          </section>
          ${t.type === "series" && t.seasons ? `
          <section class="section">
            <h2>Episodes</h2>
            <div class="season-tabs" id="seasonTabs">${t.seasons.map((s, i) => `<button class="season-tab${i === 0 ? " active" : ""}" data-season="${i}">Season ${s.number}</button>`).join("")}</div>
            <div class="episode-list" id="episodeList"></div>
          </section>` : ""}
        </div>
        <aside>
          <section class="section">
            <h2>Details</h2>
            <dl class="side-meta">
              <dt>Director</dt><dd>${esc(t.director)}</dd>
              <dt>Released</dt><dd>${t.year}</dd>
              <dt>Runtime</dt><dd>${t.runtime}</dd>
              <dt>Country</dt><dd>${esc(t.country)}</dd>
              <dt>Rating</dt><dd>${t.age}</dd>
              <dt>Score</dt><dd style="color:var(--gold)">★ ${t.rating.toFixed(1)} / 10</dd>
            </dl>
          </section>
        </aside>
      </section>`;

    // watchlist
    const wb = $("#watchBtn");
    function paintWatch() {
      const inList = watchlist.has(t.id);
      wb.classList.toggle("in", inList);
      wb.innerHTML = inList
        ? `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.285 6.709a1 1 0 00-1.414 0L9.5 16.08 5.129 11.71a1 1 0 10-1.414 1.414l5.078 5.078a1 1 0 001.414 0l10.078-10.08a1 1 0 000-1.413z"/></svg> In Watchlist`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14M5 12h14"/></svg> Add to Watchlist`;
    }
    paintWatch();
    wb.addEventListener("click", () => { const added = watchlist.toggle(t.id); paintWatch(); toast(added ? "Added to watchlist" : "Removed from watchlist"); });

    // episodes
    if (t.type === "series" && t.seasons) {
      const list = $("#episodeList");
      function renderSeason(i) {
        list.innerHTML = t.seasons[i].episodes.map(ep => `
          <a class="episode" href="#/player?id=${t.id}&ep=${ep.n}">
            <div class="ep-num">${ep.n}</div>
            <div class="ep-info"><div class="ep-title">${esc(ep.title)}</div><p class="ep-syn">${esc(ep.syn)}</p></div>
            <div class="ep-runtime">${ep.runtime}</div>
          </a>`).join("");
      }
      renderSeason(0);
      $$("#seasonTabs .season-tab").forEach(b => b.addEventListener("click", () => {
        $$("#seasonTabs .season-tab").forEach(x => x.classList.remove("active"));
        b.classList.add("active");
        renderSeason(parseInt(b.dataset.season, 10));
      }));
    }

    // trailer modal
    const modal = $("#trailerModal");
    function openTrailer() { modal.classList.add("open"); const v = $("#trailerVideo"); v.currentTime = 0; v.play().catch(() => {}); }
    function closeTrailer() { modal.classList.remove("open"); const v = $("#trailerVideo"); v.pause(); }
    $("#trailerBtn").addEventListener("click", openTrailer);
    $("#trailerCard").addEventListener("click", openTrailer);
    modal.querySelector("[data-close-trailer]").addEventListener("click", closeTrailer);
    modal.addEventListener("click", e => { if (e.target === modal) closeTrailer(); });
    window.addEventListener("keydown", e => { if (e.key === "Escape" && modal.classList.contains("open")) closeTrailer(); });

    // related
    let rel = (t.related || []).map(find).filter(Boolean);
    if (rel.length < 6) {
      const fill = TITLES.filter(x => x.id !== t.id && !rel.includes(x)).slice(0, 6 - rel.length);
      rel = rel.concat(fill);
    }
    $("#relatedTrack").innerHTML = rel.map(posterCardHTML).join("");

    history.push(t.id);
  }

  /* ============================================================
     PLAYER
  ============================================================ */
  function initPlayer(params) {
    const id = params.get("id") || "shawshank";
    const epParam = parseInt(params.get("ep") || "0", 10);
    const t = find(id) || TITLES[0];
    document.title = t.title + " — Ethan Vale";

    const video = $("#video");
    const playBtn = $("#playBtn");
    const muteBtn = $("#muteBtn");
    const progress = $("#progress");
    const progressFill = $("#progressFill");
    const progressThumb = $("#progressThumb");
    const timeNow = $("#timeNow"), timeTotal = $("#timeTotal");
    const pTitle = $("#pTitle");
    const playerTop = $("#playerTop"), playerControls = $("#playerControls");
    const epDrawer = $("#epDrawer"), epBtn = $("#epBtn");
    const back10 = $("#back10"), fwd10 = $("#fwd10"), fsBtn = $("#fsBtn");

    pTitle.textContent = t.title + (t.type === "series" && epParam ? ` · Episode ${epParam}` : "");

    // drawer
    $("#drawerTitle").textContent = t.title;
    $("#drawerSub").textContent = t.type === "series" ? "Episodes" : "Feature presentation";
    if (t.type === "series" && t.seasons) {
      $("#epList").innerHTML = t.seasons.flatMap(s => s.episodes.map(ep => `
        <a class="ep-item${ep.n === epParam ? " active" : ""}" href="#/player?id=${t.id}&ep=${ep.n}">
          <div class="ep-t">${esc(ep.title)}</div>
          <div class="ep-n">Season ${s.number} · Episode ${ep.n} · ${ep.runtime}</div>
        </a>`)).join("");
    } else {
      $("#epList").innerHTML = `<div class="ep-item active"><div class="ep-t">${esc(t.title)}</div><div class="ep-n">${t.year} · ${t.runtime}</div></div>`;
      epBtn.style.display = "none";
    }
    epBtn.addEventListener("click", () => epDrawer.classList.toggle("open"));
    epDrawer.addEventListener("click", e => { if (e.target === epDrawer) epDrawer.classList.remove("open"); });

    const fmt = s => { if (!isFinite(s)) return "0:00"; s = Math.max(0, Math.floor(s)); const m = Math.floor(s / 60), r = s % 60; return m + ":" + (r < 10 ? "0" + r : r); };

    video.pause();
    video.currentTime = 0;
    playBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';

    const togglePlay = () => { if (video.paused) video.play().catch(() => {}); else video.pause(); };
    playBtn.addEventListener("click", togglePlay);
    video.addEventListener("click", togglePlay);
    video.addEventListener("play",  () => { playBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>'; });
    video.addEventListener("pause", () => { playBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'; });

    back10.addEventListener("click", () => { video.currentTime = Math.max(0, video.currentTime - 10); });
    fwd10.addEventListener("click", () => { video.currentTime = Math.min(video.duration || 0, video.currentTime + 10); });
    muteBtn.addEventListener("click", () => {
      video.muted = !video.muted;
      muteBtn.innerHTML = video.muted
        ? '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3l2.5 2.5-1.5 1.5-2.5-2.5-2.5 2.5-1.5-1.5L13 12l-2.5-2.5 1.5-1.5L14.5 10.5 17 8l1.5 1.5L16 12z"/></svg>'
        : '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3z"/></svg>';
    });
    fsBtn.addEventListener("click", () => { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {}); });

    function updateProgress() {
      const d = video.duration || 0, c = video.currentTime || 0, p = d ? c / d : 0;
      progressFill.style.width = (p * 100) + "%";
      progressThumb.style.left = (p * 100) + "%";
      timeNow.textContent = fmt(c); timeTotal.textContent = fmt(d);
    }
    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadedmetadata", updateProgress);
    video.addEventListener("durationchange", updateProgress);
    progress.addEventListener("click", e => {
      const r = progress.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      if (video.duration) video.currentTime = ratio * video.duration;
    });

    let hideTimer = null;
    function showUI() {
      playerTop.classList.remove("hide"); playerControls.classList.remove("hide");
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => { if (!video.paused) { playerTop.classList.add("hide"); playerControls.classList.add("hide"); } }, 2800);
    }
    document.addEventListener("pointermove", showUI);
    showUI();
    video.play().catch(() => {});
    history.push(t.id);
  }

  /* ============================================================
     SEARCH
  ============================================================ */
  function initSearch(params) {
    const searchState = initSearch._state || (initSearch._state = {});
    if (!searchState.inited) {
      searchState.inited = true;
      const input = $("#searchInput"), go = $("#searchGo"), sugg = $("#suggestions");
      const filtersEl = $("#filters");
      searchState.query = ""; searchState.genre = ""; searchState.type = "";

      filtersEl.innerHTML = ["All"].concat(genres()).map(g => {
        const val = g === "All" ? "" : g;
        return `<button class="chip" data-genre="${esc(val)}">${esc(g)}</button>`;
      }).join("");
      filtersEl.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => {
        searchState.genre = c.dataset.genre;
        filtersEl.querySelectorAll(".chip").forEach(x => x.classList.remove("active"));
        c.classList.add("active");
        renderResults();
      }));

      function matches(t) {
        if (searchState.genre && !t.genres.includes(searchState.genre)) return false;
        if (searchState.type && t.type !== searchState.type) return false;
        if (!searchState.query) return true;
        const q = searchState.query.toLowerCase();
        return t.title.toLowerCase().includes(q) || t.director.toLowerCase().includes(q) || t.cast.some(c => c.toLowerCase().includes(q)) || t.genres.some(g => g.toLowerCase().includes(q));
      }
      function renderResults() {
        const results = TITLES.filter(matches);
        const titleEl = $("#resultsTitle"), countEl = $("#resultsCount");
        if (searchState.query) titleEl.textContent = `Results for "${searchState.query}"`;
        else if (searchState.genre) titleEl.textContent = searchState.genre;
        else if (searchState.type) titleEl.textContent = searchState.type === "series" ? "Series" : "Films";
        else titleEl.textContent = "All Titles";
        countEl.textContent = `${results.length} title${results.length === 1 ? "" : "s"}`;
        $("#resultsGrid").innerHTML = results.length
          ? results.map(posterCardHTML).join("")
          : `<div class="empty" style="grid-column:1/-1">Nothing matched your search.<small>Try a different title, director, or genre.</small></div>`;
      }
      searchState.render = renderResults;

      function showSugg() {
        if (!searchState.query) { sugg.classList.remove("show"); return; }
        const q = searchState.query.toLowerCase();
        const list = TITLES.filter(t => t.title.toLowerCase().includes(q) || t.director.toLowerCase().includes(q) || t.cast.some(c => c.toLowerCase().includes(q))).slice(0, 6);
        if (!list.length) { sugg.classList.remove("show"); return; }
        sugg.innerHTML = list.map(t => `
          <a class="suggestion" href="#/detail?id=${t.id}">
            <img src="${t.poster}" alt=""><div><div class="s-t">${esc(t.title)}</div><div class="s-m">${t.year} · ${esc(t.director)}</div></div>
          </a>`).join("");
        sugg.classList.add("show");
      }

      let debounce;
      input.addEventListener("input", () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => { searchState.query = input.value.trim(); showSugg(); renderResults(); }, 180);
      });
      input.addEventListener("focus", showSugg);
      document.addEventListener("click", e => { if (!e.target.closest(".search-wrap")) sugg.classList.remove("show"); });
      go.addEventListener("click", () => { searchState.query = input.value.trim(); sugg.classList.remove("show"); renderResults(); });
      input.addEventListener("keydown", e => { if (e.key === "Enter") { searchState.query = input.value.trim(); sugg.classList.remove("show"); renderResults(); } });

      searchState.input = input;
      searchState.filtersEl = filtersEl;
    }

    // apply incoming params
    searchState.query = params.get("q") || "";
    searchState.genre = params.get("genre") || "";
    searchState.type  = params.get("type")  || "";
    searchState.input.value = searchState.query;
    searchState.filtersEl.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c.dataset.genre === searchState.genre));
    searchState.render();
  }

  /* ============================================================
     PROFILE
  ============================================================ */
  function initProfile() {
    if (!profileInited) {
      profileInited = true;
      $$(".tab").forEach(tab => tab.addEventListener("click", () => {
        $$(".tab").forEach(t => t.classList.remove("active"));
        $$(".tab-panel").forEach(p => p.classList.remove("active"));
        tab.classList.add("active");
        $(`[data-panel="${tab.dataset.tab}"]`).classList.add("active");
      }));
      $$("[data-switch]").forEach(sw => sw.addEventListener("click", () => sw.classList.toggle("on")));
    }

    // watchlist
    const watchIds = watchlist.get();
    const watchT = watchIds.map(find).filter(Boolean);
    $("#watchCount").textContent = `${watchT.length} title${watchT.length === 1 ? "" : "s"}`;
    $("#watchGrid").innerHTML = watchT.length
      ? watchT.map(posterCardHTML).join("")
      : `<div class="empty" style="grid-column:1/-1">Nothing on your watchlist yet.<small>Find a title and add it.</small><div><a class="btn small" href="#/archive" style="margin-top:20px">Browse Archive</a></div></div>`;

    // history
    const histIds = history.get();
    const histT = histIds.map(find).filter(Boolean);
    $("#histCount").textContent = `${histT.length} title${histT.length === 1 ? "" : "s"}`;
    $("#histGrid").innerHTML = histT.length
      ? histT.map(posterCardHTML).join("")
      : `<div class="empty" style="grid-column:1/-1">No viewing history yet.<small>Open any title and it will appear here.</small><div><a class="btn small" href="#/home" style="margin-top:20px">Back Home</a></div></div>`;
  }

  /* ============================================================
     BOOT
  ============================================================ */
  const initial = parseHash();
  if (initial.path === "archive") document.body.classList.add("locked");
  showView(initial.path, initial.params);

})();