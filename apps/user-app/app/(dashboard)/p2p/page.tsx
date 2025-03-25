import { getServerSession } from "next-auth";
import { SendCard } from "../../../components/SendMoney";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { P2PTransactions } from "../../../components/P2PTransactions";

const getP2PTransactions = async () => {
  const session = await getServerSession(authOptions);
  const txn = await prisma.p2PTransfers.findMany({
    where: {
      fromUserID: Number(session?.user?.id),
    },
  });

  return txn.map((txn) => ({
    time: txn.timestamp,
    amount: txn.amount,
  }));
};

export default async function () {
  const transactions = await getP2PTransactions();
  return (
    <div className="w-screen">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div className="w-full">
          <SendCard />
        </div>
        <div className="flex flex-col justify-center">
          <P2PTransactions transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
