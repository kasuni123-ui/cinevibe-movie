const router = require('express').Router();
const Title = require('../models/Title');

const PROJECT = { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 };
const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.get('/', async (req, res) => {
  try { res.json(await Title.find({}, PROJECT).sort({ rating: -1 })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/search', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const filter = {};
    if (req.query.genre) filter.genres = req.query.genre;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.year) filter.year = { $gte: parseInt(req.query.year, 10) };
    if (q) {
      const re = new RegExp(escapeRe(q), 'i');
      filter.$or = [{ title: re }, { director: re }, { cast: re }, { genres: re }];
    }
    res.json(await Title.find(filter, PROJECT));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const title = await Title.findOne({ id: req.params.id }, PROJECT);
    if (!title) return res.status(404).json({ error: 'Title not found' });
    res.json(title);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
