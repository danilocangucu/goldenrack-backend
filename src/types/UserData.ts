import mongoose from "mongoose";
import { OrderListData } from "./OrderData";
import { RoleData } from "./RoleData";

export interface UserData {
  id: string;
  email: string;
  userName: string;
  password?: string;
  hashedPassword: string;
  firstName: string;
  lastName: string;
  role: RoleData;
  banned: boolean;
  orderHistory: OrderListData[] | mongoose.Types.ObjectId[];
}

export type UserRegistrationData = Partial<
  Omit<UserData, "id" | "hashedPassword" | "role" | "banned" | "orderHistory">
>;
