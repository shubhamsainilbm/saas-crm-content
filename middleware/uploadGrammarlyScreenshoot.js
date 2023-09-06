import multer from "multer";
import { formatDate } from "../functions/dateFunction.js";
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("file", file);
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      return cb(null, "public/uploads/grammarlyScreenshots");
    } else {
      return cb(null, "public/uploads/blogDocument");
    }
    // if (req.files?.grammarlyScreenshot) {
    // }
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

const uploadGrammarlyScreenshoot = multer({ storage });
export default uploadGrammarlyScreenshoot;
