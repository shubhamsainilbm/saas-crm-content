import JWT from "jsonwebtoken";

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(200).json({
      message: "Not Authorized",
    });
  }
  const token = authHeader.split(" ")[1];

  try {
    JWT.verify(token, process.env.ACCESS_TOKEN, (err, decode) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ message: "Forbidden Error" });
      }
      req.userId = decode.userInfo.userId;
      req.email = decode.userInfo.userEmail;
      req.role = decode.userInfo.userRole;
      next();
    });
  } catch (error) {
    console.log(error);
  }
};

export default verifyJWT;
