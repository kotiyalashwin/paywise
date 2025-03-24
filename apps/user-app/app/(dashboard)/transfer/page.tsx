import prisma from "../../../../../packages/db/src";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { AddMoney } from "../../../components/AddMoney";
import { BalanceCard } from "../../../components/BalanceCard";
import { useState } from "react";
import {
  OnRampTransactions,
  OnRampTransactionStatus,
} from "../../../components/OnRampTransaction";
import { createOnRampTransaction } from "../../lib/actions/createOnRampTransaction";

//GET BALANCE FROM DB
async function getBalance() {
  const session = await getServerSession(authOptions);
  const balance = await prisma.balances.findFirst({
    where: {
      userId: Number(session?.user?.id),
    },
  });

  return {
    amount: balance?.amount || 0,
    locked: balance?.locked || 0,
  };
}

//GET TRANSACTIONS FROM DB and return {time,amount,status,provider}
async function getOnRampTransactions() {
  const session = await getServerSession(authOptions);
  const txns = await prisma.onRampTransaction.findMany({
    where: {
      userId: Number(session?.user?.id),
    },
  });
  // console.log(txns);

  return txns.map((txn) => ({
    time: txn.startTime,
    status: txn.status as OnRampTransactionStatus,
    amount: txn.amount,
    provider: txn.provider,
  }));
}

export default async function () {
  const balance = await getBalance();
  // console.log(balance);
  const transactions = await getOnRampTransactions();
  return (
    <div className="w-screen">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Transfer
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div>
          <AddMoney />
        </div>
        <div>
          <BalanceCard amount={balance.amount} locked={balance.locked} />
          <div className="pt-4">
            <OnRampTransactions transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}
