import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";

const __dirname = path.resolve();

const logEvents = async (message, loggerFile) => {
  const date = new Date().toLocaleString();
  const messages = `${date}\t${message}\n`;
  try {
    if (!fs.existsSync(path.join(__dirname, "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "logs", loggerFile),
      messages
    );
  } catch (error) {
    console.log(error);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");

  console.log(`${req.method}\t${req.url}`);

  // console.log("dsdjaklj",req.connection.remoteAddress , req.headers);
  next();
};

export { logEvents, logger };
