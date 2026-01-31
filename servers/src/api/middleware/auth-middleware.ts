import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../context.js";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: "Missing Authorization header" });
    return;
  }

  const authParts = authHeader.split(" ");
  if (authParts.length !== 2) {
    res.status(401).json({ error: "Invalid Authorization format" });
    return;
  }
  const token = authParts[1]!;

  try {
    const decoded = jwt.verify(token, JWT_SECRET as jwt.Secret) as {
      userId: string;
      email: string;
    };
    req.user = {
      id: decoded.userId,
      email: decoded.email,
    };
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
};
