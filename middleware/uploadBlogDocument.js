import multer from "multer";
import { formatDate } from "../functions/dateFunction.js";
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "public/uploads/blogDocument");
  },
  filename: (req, file, cb) => {
    console.log();
    let userEmail = req.email.split("@")[0];
    return cb(
      null,
      `${Date.now()}_${formatDate(new Date())}-${userEmail}.${
        file.originalname.split(".")[1]
      }`
    );
  },
});

const uploadBlogDocument = multer({ storage });
export default uploadBlogDocument;
