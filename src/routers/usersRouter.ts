import express from "express";

import ordersRouter from "./ordersRouter";
import { hasPermission } from "../middlewares/hasPermission";
import { isRequestedUser } from "../middlewares/isRequestedUser";
import {
  banUserHandler,
  changePasswordHandler,
  recoverPasswordHandler,
  getAllUsers,
  deleteUser,
  getUserByIdHandler,
  updateUser,
} from "../controllers/usersController";

import { isAdmin } from "../middlewares/isAdmin";

const usersRouter = express.Router();

// TODO check hasPermission middleware with "/:userId/orderlists"
usersRouter.use("/:userId/orderlists", ordersRouter);
usersRouter.get(
  "/:userId/recover-password",
  isRequestedUser,
  recoverPasswordHandler
);
usersRouter.post(
  "/:userId/change-password",
  isRequestedUser,
  changePasswordHandler
);
usersRouter.patch("/:userId/ban", isAdmin, banUserHandler);
usersRouter.get("/", getAllUsers, isAdmin);
usersRouter.delete("/:userId", hasPermission, deleteUser);
usersRouter.get("/:userId", hasPermission, getUserByIdHandler);
usersRouter.put("/:userId", hasPermission, updateUser);

export default usersRouter;
