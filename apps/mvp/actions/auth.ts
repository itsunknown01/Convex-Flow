"use server";

import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/constants";

/**
 * Login action - authenticates user with backend and stores session.
 *
 * Backend returns: { token, user: { id, email } }
 * We need to set cookies and return data for Zustand store.
 */
export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { msg: "Email and password are required" };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    if (!res.ok) {
      const error = await res.json();
      return { msg: error.error || "Login failed" };
    }

    const data = await res.json();
    // Backend returns: { token, user: { id, email }, tenantId }
    const { token, user, tenantId } = data;

    if (!token || !user) {
      return { msg: "Invalid response from server" };
    }

    // Set 24h expiration to match token
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Store session cookie (HTTP-only for security)
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expires,
      sameSite: "lax",
      path: "/",
    });

    // Valid tenantId only
    if (tenantId) {
      cookieStore.set("tenantId", tenantId, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        expires: expires,
        sameSite: "lax",
        path: "/",
      });
    }

    // Return user info for Zustand sync
    return {
      success: true,
      user: { id: user.id, email: user.email },
      token: token,
      tenantId: tenantId || null,
    };
  } catch (err) {
    console.error("Login error:", err);
    return { msg: "Failed to connect to backend" };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.delete("tenantId");
}
