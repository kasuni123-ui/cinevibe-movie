const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/watchlist', async (req, res) => {
  try { res.json((await User.findById(req.userId)).watchlist); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/watchlist/:id', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const id = req.params.id;
    const had = user.watchlist.includes(id);
    user.watchlist = had ? user.watchlist.filter(x => x !== id) : [id, ...user.watchlist];
    await user.save();
    res.json({ in: !had, watchlist: user.watchlist });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/history', async (req, res) => {
  try { res.json((await User.findById(req.userId)).history); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/history/:id', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const id = req.params.id;
    user.history = [id, ...user.history.filter(x => x !== id)].slice(0, 30);
    await user.save();
    res.json({ history: user.history });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
