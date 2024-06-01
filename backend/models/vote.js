const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  voterId: String,
  pollId: mongoose.Schema.Types.ObjectId,
  selectedOption: Number,
});

module.exports = mongoose.model('Vote', voteSchema);
