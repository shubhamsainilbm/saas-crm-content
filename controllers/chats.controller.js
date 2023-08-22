import chatsModel from "../models/chats.model.js";
import userModel from "../models/user.model.js";

export const createChats = async (req, res) => {
  const { userId } = req.body;
  try {
    if (!userId) {
      return res.status(400).json({ message: "User id is required" });
    }

    let isChat = await chatsModel
      .find({
        $and: [
          { users: { $elemMatch: { $eq: req.userId } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await userModel.populate(isChat, {
      path: "latestMessage.sender",
      select: "name email image",
    });
    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      let chatData = {
        chatName: "sender",
        users: [req.userId, userId],
      };

      try {
        const createdChat = await chatsModel.create(chatData);
        const allChats = await chatsModel
          .findOne({ _id: createdChat._id })
          .populate("users", "-password");
        res.status(200).json(allChats);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const getChats = async (req, res) => {
  try {
    chatsModel
      .find({ users: { $elemMatch: { $eq: req.userId } } })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await userModel.populate(results, {
          path: "latestMessage.sender",
          select: "name image email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
