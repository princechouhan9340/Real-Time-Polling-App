// models/Poll.js
const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ option: String, votes: { type: Number, default: 0 } }],
});

module.exports = mongoose.model('Poll', PollSchema);
