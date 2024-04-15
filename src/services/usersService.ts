import User, { UserDocument } from "../models/User";
import {
  comparePasswords,
  generateAuthToken,
  hashPassword,
} from "../utils/authUtils";
import { generateNewPassword } from "../utils/usersUtils";

async function recoverPassword(
  userId: string
): Promise<{ newPassword: string; token: string }> {
  const newPassword = generateNewPassword();

  const hashedPassword = await hashPassword(newPassword);

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { hashedPassword: hashedPassword },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    const token = generateAuthToken(user);

    return { newPassword, token };
  } catch (error) {
    console.error("Failed to recover password:", error);
    throw new Error("Failed to recover password");
  }
}

async function changePassword(
  email: string,
  oldPassword: string,
  newPassword: string
): Promise<void> {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await comparePasswords(
    oldPassword,
    user.hashedPassword
  );

  if (!isPasswordValid) {
    throw new Error("Old password is incorrect");
  }

  const newPasswordHashed = await hashPassword(newPassword);

  user.hashedPassword = newPasswordHashed;
  await user.save();
}

async function banUser(userId: string, isBanned: boolean): Promise<void> {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.banned = isBanned;

    await user.save();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to ban/unban user.");
  }
}

export const getAllUsers = async () => {
  const foundUsers = await User.find();
  if (foundUsers) {
    return foundUsers;
  }
  throw new Error("Users not available");
};

export const getUserById = async (id: string) => {
  try {
    const searchById = await User.findById(id);
    if (!searchById) {
      throw new Error("No user with this Id");
    }
    return searchById;
  } catch (error) {
    throw new Error("Failed to process you request.");
  }
};

export const deleteUserById = async (userId: string) => {
  const deleteUser = await User.findByIdAndDelete(userId);
  if (deleteUser) {
    return deleteUser;
  }
  throw new Error("Error in deleting a user");
};

export const updateUserById = async (
  userId: string,
  newInformation: Partial<UserDocument>
) => {
  try {
    const findUserUpdate = await User.findByIdAndUpdate(
      userId,
      newInformation,
      {
        new: true,
      }
    );
    if (!findUserUpdate) {
      throw new Error("The information does not match");
    }
    return findUserUpdate;
  } catch (error) {
    throw new Error("Unable to to update this information.");
  }
};

export const createNewUser = async (
  user: UserDocument
): Promise<UserDocument> => {
  return await user.save();
};
export default {
  recoverPassword,
  changePassword,
  banUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  createNewUser,
};
