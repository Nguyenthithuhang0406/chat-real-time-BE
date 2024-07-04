const Messages = require("../model/messages.model");

const addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) {
      return res.json({
        code: 201,
        message: "Message sent successfully",
        data,
      });
    }
    return res.json({
      code: 400,
      message: "Message not sent",
    });
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await Messages.find({
      users: { $all: [from, to] },
    }).sort({ updatedAt: 1 });
    
    const projectMessages = messages.map((msg) => {
      return {
        message: msg.message.text,
        fromSelf: msg.sender.toString() === from,
      };
    });

    res.json(projectMessages);

  } catch (error) {
    next(error);
  }
};

module.exports = { addMessage, getMessages };