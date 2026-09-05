"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signUpSchema } from "@/lib/validators";

export async function registerUser(formData: FormData | { name: string; email: string; password: string }) {
  const data =
    formData instanceof FormData
      ? {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          password: formData.get("password") as string,
        }
      : formData;

  const parsed = signUpSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: { email: ["Email already in use"] } };
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });

  return { success: true, userId: user.id };
}
