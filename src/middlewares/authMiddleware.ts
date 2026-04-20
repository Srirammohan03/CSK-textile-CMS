import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import prisma from "../config/db.js";

interface DecodedToken {
  id: number;
  name: string;
  email: string;
  role: "admin" | "editor";
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: "admin" | "editor";
    name: string;
  };
}

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!,
      ) as DecodedToken;
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, role: true, name: true },
      });

      if (!user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      req.user = user;
      next();
    }
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const admin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin" });
  }
};
