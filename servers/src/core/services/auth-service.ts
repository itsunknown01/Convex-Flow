import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "@workspace/database";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async register(email: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: { email, passwordHash },
    });
    return { id: user.id, email: user.email };
  }

  async login(email: string, password: string) {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) throw new Error("Invalid credentials");

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "24h",
    });

    const membership = await db.membership.findFirst({
      where: { userId: user.id },
      select: { tenantId: true },
    });

    return {
      token,
      user: { id: user.id, email: user.email },
      tenantId: membership?.tenantId || null,
    };
  }
}
