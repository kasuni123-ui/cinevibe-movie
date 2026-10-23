const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({ n: Number, title: String, runtime: String, syn: String }, { _id: false });
const seasonSchema = new mongoose.Schema({ number: Number, episodes: [episodeSchema] }, { _id: false });

const titleSchema = new mongoose.Schema({
  id:        { type: String, unique: true, required: true, index: true },
  title:     { type: String, required: true },
  year:      Number,
  type:      { type: String, enum: ['movie', 'series'], default: 'movie' },
  genres:    [String],
  runtime:   String,
  rating:    Number,
  age:       String,
  country:   String,
  director:  String,
  cast:      [String],
  poster:    String,
  backdrop:  String,
  synopsis:  String,
  related:   [String],
  seasons:   [seasonSchema],
  tall:      Boolean
}, { timestamps: true });

module.exports = mongoose.model('Title', titleSchema);
