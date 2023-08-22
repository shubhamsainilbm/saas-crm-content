import commentsModel from "../models/comments.model.js";
import userModel from "../models/user.model.js";

export const getComments = async (req, res) => {
  try {
    const comment = await commentsModel
      .find()
      .populate("userId", { email: 1, image: 1 });

    res.status(200).json({ success: true, comment });
  } catch (error) {
    console.log(error);
  }
};

export const addComment = async (req, res) => {
  const { id, comment } = req.body;
  try {
    if (!id || !comment) {
      return res.status(400).json({
        success: false,
        message: "All Fields Are Required",
      });
    }
    const getUserInfo = await userModel.findOne({ _id: req.userId });
    await commentsModel.create({
      jobId: id,
      comment: comment,
      userId: req.userId,
    });
    res.send("Add Comments Successfully");
  } catch (error) {
    console.log(error);
  }
};
