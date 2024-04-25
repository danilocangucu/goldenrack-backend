export interface DecodedJwtPayload {
  userId: string;
  userRole: string;
  isUserBanned: boolean;
  iat: number;
  exp: number;
  currentOrderList: string;
}
