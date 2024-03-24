import { Request, Response, NextFunction } from "express";
import { extractPropertyFromJwt, checkAuthorization } from "../utils/authUtils";
import { JwtProperty } from "../types/JwtProperty";

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const decodedToken = checkAuthorization(req);

    const userRole = extractPropertyFromJwt(decodedToken, JwtProperty.UserRole);

    if (userRole === "Admin") {
      next();
    } else {
      throw new Error("User is not authorized");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in isAdmin middleware:", error);
      return res.status(403).json({
        status: "fail",
        message:
          error.message || "You are not authorized to perform this action.",
      });
    } else {
      console.error("Unknown error in isAdmin middleware:", error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
}
