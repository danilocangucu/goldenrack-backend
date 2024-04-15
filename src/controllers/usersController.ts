import { Request, Response } from "express";
import userService from "../services/usersService";
import User from "../models/User";

export async function recoverPasswordHandler(
  request: Request,
  response: Response
) {
  try {
    const userId = request.params.userId;
    const { newPassword, token } = await userService.recoverPassword(userId);

    response.status(200).json({
      status: "success",
      data: {
        newPassword,
        token,
      },
      message: "Password recovered successfully",
    });
  } catch (error) {
    console.error("Error recovering password:", error);
    response.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}

export async function changePasswordHandler(req: Request, res: Response) {
  const { email, oldPassword, newPassword } = req.body;

  try {
    await userService.changePassword(email, oldPassword, newPassword);
    res
      .status(200)
      .json({ status: "success", message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error while changing password" });
  }
}

export async function banUserHandler(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    const isBanned = req.body.banned;

    if (typeof isBanned !== "boolean") {
      res.status(400).json({
        status: "error",
        message: 'Invalid input. "banned" field must be a boolean',
      });
      return;
    }

    await userService.banUser(userId, isBanned);
    res.status(200).json({
      status: "success",
      message: `User ${userId} ${
        isBanned ? "banned" : "unbanned"
      } successfully.`,
    });
  } catch (error) {
    console.error("Error banning/unbanning user:", error);
    res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
}

export async function getAllUsers(_: Request, response: Response) {
  try {
    const userList = await userService.getAllUsers();
    response.status(200).json({
      data: userList,
      message: "users retrieved successfully",
      status: "success",
    });
  } catch (error) {
    return response.sendStatus(400).json({
      message: `The search users  do not exist.`,
      status: "failed",
    });
  }
}

export async function getUserByIdHandler(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const singleUser = await userService.getUserById(userId);

    if (!singleUser) {
      return res
        .status(404)
        .json({ message: `No user with Id : ${userId}`, status: "failed" });
    }
    res.status(200).json({
      data: singleUser,
      message: "user retrieved successfully",
      status: "success",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in fetching single user", status: "error" });
  }
}

export async function deleteUser(request: Request, response: Response) {
  try {
    const { userId } = request.params;

    const userDelete = await userService.deleteUserById(userId);
    if (!userDelete) {
      return response.status(400).json({
        message: `The search user ${userDelete} do not exist.`,
        status: "failed",
      });
    }
    response.status(200).json({
      data: userDelete,
      message: "users deleted successfully",
      status: "success",
    });
  } catch (error) {
    return response
      .sendStatus(400)
      .json({ message: "Error in deleting user", status: "error" });
  }
}

export async function updateUser(request: Request, response: Response) {
  try {
    const { userId } = request.params;

    const userUpdate = await userService.updateUserById(userId, request.body);

    if (!userUpdate) {
      return response.status(404).json({
        message: "cannot update with the specified parameter.",
        status: "failed",
      });
    }

    const updatedUser = await User.findById(userId);

    response.status(200).json({
      data: updatedUser,
      message: "users information updated successfully",
      status: "success",
    });
  } catch (error) {
    return response.status(500).json({
      message: "Error in fetching user information",
      status: "failed",
    });
  }
}

export async function postNewUser(req: Request, res: Response) {
  try {
    const newData = new User(req.body);
    const newUser = await userService.createNewUser(newData);

    if (!newData.firstName || !newData.lastName) {
      return res
        .status(400)
        .json({ message: "Firstname and Lastname are required" });
    }
    res.status(201).json({
      data: newUser,
      message: "New user added successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
