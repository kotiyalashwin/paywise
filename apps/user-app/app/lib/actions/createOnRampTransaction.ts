"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function createOnRampTransaction(
  amount: number,
  provider: string
) {
  //get current user from server
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  //idealy get token from the bank API
  const token = Math.random().toString();

  if (!userId) {
    return {
      message: "User not logged in",
    };
  }

  await prisma.onRampTransaction.create({
    data: {
      amount: amount * 100,
      provider: provider,
      userId: Number(userId),
      status: "Pending",
      startTime: new Date(),
      token: token,
    },
  });
}
