// controllers/chatController.js
const Chat = require('../models/chat');

const saveMessage = async (message) => {
  const chatMessage = new Chat(message);
  await chatMessage.save();
  return chatMessage;
};

const getChats = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ timestamp: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve chats', error });
  }
};
module.exports = {
    getChats,
    saveMessage
}
