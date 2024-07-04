import UserController from "@controllers/user.controller";
import { Router } from "express";

const UserRouter = Router();
const userController = new UserController();

UserRouter.post("/create-api-key", userController.create_api_key);

export default UserRouter;
