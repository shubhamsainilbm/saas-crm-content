import Router from "express";
import { createRoles } from "../controllers/roles.controller.js";

const router = Router();


router.post("/create-roles", createRoles)


export default router