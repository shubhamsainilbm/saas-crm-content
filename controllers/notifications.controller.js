import notificationsModel from "../models/notifications.model.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationsModel
      .find()
      .populate("jobId", { blogTitle: 1, priority: 1 });

    res.json({ notifications });
  } catch (error) {
    console.log(error);
  }
};
