"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

// Problem
// We did not LOCK the db for sendUser, if multiple transaction happends at one then there can
// be a problem in the database,so we need to use LOCK property
//prisma.$queryraw(SElECT.....FOR UPDATE)

//LOCKING ROW IN DATABASE
export async function p2pTransfer(to: string, amount: number) {
  const session = await getServerSession(authOptions);

  //GET fromUser
  const from = session?.user?.id;

  if (!from) {
    return {
      message: "Error While sending : Sender not found ",
    };
  }

  // get to User
  const toUser = await prisma.user.findUnique({
    where: {
      number: to,
    },
  });

  if (!toUser) {
    return {
      message: "Error While sending : Reciever not found ",
    };
  }

  // init transaction
  await prisma.$transaction(async (txn) => {
    //LOCK senderBALANCE ROW
    //RAW SQL QUERY
    await txn.$queryRaw`SELECT * FROM "Balances" WHERE "userId"= ${Number(from)} FOR UPDATE  `;
    const fromBalance = await txn.balances.findUnique({
      where: {
        userId: Number(from),
      },
    });

    if (!fromBalance || fromBalance.amount < amount) {
      return {
        message: "Unsufficient Balanec",
      };
    }

    //decrement from sender

    await txn.balances.update({
      where: {
        userId: Number(from),
      },
      data: {
        amount: { decrement: amount },
      },
    });

    // increment for reciever
    await txn.balances.update({
      where: { userId: Number(toUser.id) },
      data: { amount: { increment: amount } },
    });

    await txn.p2PTransfers.create({
      data: {
        fromUserID: Number(from),
        toUserID: Number(toUser.id),
        amount,
        timestamp: new Date(),
      },
    });
  });
}
