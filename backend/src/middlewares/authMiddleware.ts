import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"];
  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  jwt.verify(
    token as string,
    process.env.JWT_SECRET as string,
    (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "Invalid token!" });
        return;
      }
      if (typeof decoded === "object" && decoded !== null && "id" in decoded) {
        req.userId = (decoded as jwt.JwtPayload).id as string;
      }
      next();
    }
  );
};

export default authMiddleware;
