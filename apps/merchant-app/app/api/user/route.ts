import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

// const client = new PrismaClient();

export const GET = async () => {
  await prisma.user.create({
    data: {
      number: "12345678",
      password: "abcdefgh",
    },
  });
  return NextResponse.json({
    message: "hi there",
  });
};
