import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  user: { id: number; role: number };
  iat: number;
  exp: number;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "JWT Secret is not defined" });
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    (req as any).user = decoded.user;
    next();
  } catch (err: any) {
    console.error(err.message);
    return res.status(401).json({ message: "Token is not valid" });
  }
};
