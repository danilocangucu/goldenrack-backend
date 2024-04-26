import { Request, Response, NextFunction } from "express";
import { checkAuthorization } from "../utils/authUtils";

export function isRequestedUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let { userId } = req.params;

  if (!userId) {
    userId = req.body.userId;
  }

  try {
    const decodedToken = checkAuthorization(req);

    if (decodedToken.userId === userId && !decodedToken.isUserBanned) {
      next();
    } else {
      throw new Error("User is not authorized");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in isRequestedUser middleware:", error);
      return res.status(403).json({
        status: "fail",
        message:
          error.message || "You are not authorized to perform this action.",
      });
    } else {
      console.error("Unknown error in isRequiredUser middleware:", error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
}
