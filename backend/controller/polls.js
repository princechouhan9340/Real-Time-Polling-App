// controllers/pollController.js
const Poll = require('../models/polls');

const getPolls = async (req, res) => {
  try {
    const polls = await Poll.find();
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve polls', error });
  }
};

const CreatePoll = async (data) => {
  const { question, options } = data;
  console.log("req",question,options)
  try {

    const poll = new Poll({ question, options: options.map(option => ({ option, votes: 0 })) });
    await poll.save();
    return poll
  } catch (error) {
    console.log(error.message,error)
  }
};



module.exports = {
    getPolls,
    CreatePoll,
}
