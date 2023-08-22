import { Router } from "express";
import path from "path";
const router = Router();

// router.get("/", (req, res) => {
//   res.send("sdasdsd")
// });
router.get("*", (req, res) => {
  res.sendFile("index.html", { root: "./client" });
});

export default router;
