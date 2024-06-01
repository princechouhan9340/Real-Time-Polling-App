// socket/socket.js
const Chat = require('../models/chat');
const {getPolls,CreatePoll} = require('../controller/polls');
const { saveMessage } = require('../controller/chat');
const Poll = require('../models/polls');
const Vote = require('../models/vote');

let io;

exports.initSocket = (serverIo) => {
  io = serverIo;

  io.on('connection', (socket) => {
    console.log('New client connected');

    // Send initial polls and chat messages
    sendInitialData(socket);

    // Handle incoming chat messages
    socket.on('chat message', async (data) => {
      try {
        console.log(data)
        const savedMessage = await saveMessage({ message: data.message, username: data.username }); // Replace 'Anonymous' with actual user info
        console.log(saveMessage)
        io.emit('chat message', savedMessage);
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    socket.on('create poll', async (pollData)=>{
      try {
        const createdPoll = await CreatePoll(pollData);
        io.emit('poll created', createdPoll);
      } catch (error) {
        console.error('Error creating poll:', error);
      }
    })

    socket.on('vote poll', async ({ pollId, optionIndex },voterId) => {
      try {
        // Check if the user has already voted on this poll
        console.log(pollId, optionIndex, voterId)
        const existingVote = await Vote.findOne({ voterId: voterId, pollId: pollId });

        console.log("user vote",existingVote)
        if (existingVote) {
          socket.emit('poll voted', { error: 'You can only vote once on this poll.' });
          return;
        }

        // Register the vote
        const vote = new Vote({ voterId, pollId, selectedOption: optionIndex });
        console.log(vote)
        await vote.save();

        // Update the poll's vote count
        const poll = await Poll.findById(pollId);
        if (!poll) {
          socket.emit('poll voted', { error: 'Poll not found.' });
          return;
        }

        poll.options[optionIndex].votes += 1;
        await poll.save();

        // Broadcast the updated poll
        io.emit('poll voted', poll);
      } catch (error) {
        console.error('Error handling vote:', error);
        socket.emit('poll voted', { error: 'An error occurred while processing your vote.' });
      }
    });

    socket.on('user typing', ({ username, typing }) => {
      io.emit('user typing', { username, typing });
    });

  })
};

// Send initial data (polls and chat messages) to newly connected clients
const sendInitialData = async (socket) => {
  const polls = await Poll.find();
  const chats = await Chat.find().sort({ timestamp: -1 }).limit(100);
  socket.emit('initialData', { polls, chats });
};
