import bcrypt from "bcryptjs";
import type { AdminDto, LoginResponse } from "@assetizers/shared";
import { prisma } from "../../lib/prisma";
import { signAdminToken } from "../../lib/jwt";
import { unauthorized } from "../../lib/errors";
import type { LoginInput } from "./auth.schema";

// Compared against when the email is unknown, so timing does not reveal which emails exist.
const DUMMY_HASH = bcrypt.hashSync("assetizers-timing-guard", 10);

export async function login({ email, password }: LoginInput): Promise<LoginResponse> {
  const admin = await prisma.admin.findUnique({ where: { email } });
  const valid = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH);
  if (!admin || !valid) throw unauthorized("Invalid email or password");

  return {
    token: signAdminToken({ sub: admin.id, email: admin.email }),
    admin: { id: admin.id, email: admin.email },
  };
}

export async function getAdmin(id: string): Promise<AdminDto> {
  const admin = await prisma.admin.findUnique({
    where: { id },
    select: { id: true, email: true },
  });
  if (!admin) throw unauthorized("Admin no longer exists");
  return admin;
}
