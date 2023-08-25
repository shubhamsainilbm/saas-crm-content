import multer from "multer";
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "public/uploads/users-images");
  },
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadImg = multer({ storage });
export default uploadImg;
