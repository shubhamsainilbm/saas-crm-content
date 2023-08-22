import chatsModel from "../models/chats.model.js";
import messageModel from "../models/message.model.js";
import userModel from "../models/user.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message, chatId } = req.body;

    if (!message || !chatId) {
      return res.status(400).json({ message: "All fileds are required" });
    }

    let newMessage = await messageModel.create({
      sender: req.userId,
      message: message,
      chat: chatId,
    });

    newMessage = await newMessage.populate("sender", "name image");
    newMessage = await newMessage.populate("chat");
    newMessage = await userModel.populate(newMessage, {
      path: "chat.users",
      select: "name image email",
    });

    await chatsModel.findByIdAndUpdate(chatId, {
      latestMessage: newMessage,
    });

    res.json(newMessage);
  } catch (error) {
    console.log(error);
  }
};

export const allMessages = async (req, res) => {
  try {
    const messages = await messageModel
      .find({ chat: req.params.chatId })
      .populate("sender", "name image email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
