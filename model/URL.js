const mongoose = require('mongoose');

const URL = new mongoose.Schema({
  slug: String,
  url: String,
});

module.exports = mongoose.model('url', URL);
