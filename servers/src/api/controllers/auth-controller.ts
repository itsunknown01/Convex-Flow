import { Request, Response } from "express";
import { AuthService } from "../../core/services/auth-service.js";

export class AuthController {
  public static async register(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      const result = await AuthService.getInstance().register(email, password);
      res.status(201).json(result);
    } catch (error: any) {
      if (error.code === "P2002") {
        res.status(400).json({ error: "User already exists" });
      } else {
        res.status(500).json({ error: "Registration failed" });
      }
    }
  }

  public static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      const result = await AuthService.getInstance().login(email, password);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }
}
