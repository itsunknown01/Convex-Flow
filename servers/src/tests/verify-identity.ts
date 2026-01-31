import { db } from "@workspace/database";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../api/middleware/auth-middleware.js";
import { tenantMiddleware } from "../api/middleware/tenant-middleware.js";
import { AuthenticatedRequest } from "../api/context.js";
import { Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

async function verifyIdentity() {
  console.log("Starting Identity & Tenancy Verification...");

  // 1. Setup Data
  const tenantA = await db.tenant.create({ data: { name: "Tenant A" } });
  const tenantB = await db.tenant.create({ data: { name: "Tenant B" } });

  const userA = await db.user.create({
    data: {
      email: `userA-${Date.now()}@example.com`,
      passwordHash: "hash",
      tenants: {
        create: { tenantId: tenantA.id, role: "ADMIN" },
      },
    },
  });

  const tokenA = jwt.sign({ userId: userA.id, email: userA.email }, JWT_SECRET);

  console.log("Data seeded.");

  // 2. Test Auth Middleware
  console.log("\n[Test] Auth Middleware");
  const reqA = {
    headers: { authorization: `Bearer ${tokenA}` },
  } as Partial<AuthenticatedRequest>;

  const resMock = {
    status: (code: number) => ({
      json: (body: any) => console.log(`  -> Response: ${code}`, body),
    }),
  } as unknown as Response;

  let authPassed = false;
  authMiddleware(reqA as AuthenticatedRequest, resMock, () => {
    authPassed = true;
  });

  if (authPassed && reqA.user?.id === userA.id) {
    console.log("  SUCCESS: Auth Middleware verified user.");
  } else {
    console.error("  FAILURE: Auth Middleware failed.");
    process.exit(1);
  }

  // 3. Test Tenant Middleware (Success Case)
  console.log("\n[Test] Tenant Middleware (Valid Access)");
  reqA.headers!["x-tenant-id"] = tenantA.id;

  let tenantPassed = false;
  await tenantMiddleware(reqA as AuthenticatedRequest, resMock, () => {
    tenantPassed = true;
  });

  if (tenantPassed && reqA.tenantId === tenantA.id) {
    console.log("  SUCCESS: Tenant Middleware allowed access.");
  } else {
    console.error("  FAILURE: Tenant Middleware blocked valid access.");
    process.exit(1);
  }

  // 4. Test Tenant Middleware (Cross-Tenant Access)
  console.log("\n[Test] Tenant Middleware (Cross-Tenant Access)");
  reqA.headers!["x-tenant-id"] = tenantB.id; // User A trying to access Tenant B

  let crossTenantPassed = false;
  await tenantMiddleware(reqA as AuthenticatedRequest, resMock, () => {
    crossTenantPassed = true;
  });

  if (!crossTenantPassed) {
    console.log(
      "  SUCCESS: Tenant Middleware correctly blocked cross-tenant access.",
    );
  } else {
    console.error("  FAILURE: Tenant Middleware allowed cross-tenant access!");
    process.exit(1);
  }

  console.log("\nVERIFICATION COMPLETE: Identity & Tenancy is secure.");
  process.exit(0);
}

verifyIdentity().catch((e) => {
  console.error(e);
  process.exit(1);
});
