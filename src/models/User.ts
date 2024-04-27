import mongoose, { Document } from "mongoose";
import { UserData } from "../types/UserData";
import { RoleData } from "../types/RoleData";

export type UserDocument = Document & UserData;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  password: String,
  hashedPassword: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(RoleData),
    default: RoleData.Customer,
    required: true,
  },
  banned: {
    type: Boolean,
    default: false,
    required: true,
  },
  orderHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderList",
    },
  ],
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: false,
  },
});

export default mongoose.model<UserDocument>("Users", UserSchema);
