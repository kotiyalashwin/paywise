import express from "express";
import db from "@repo/db/client";

const app = express();
app.use(express.json());

app.post("/hdfcwebhook", async (req, res) => {
  //zod validations
  const paymentInfor: {
    token: string;
    userId: string;
    amount: string;
  } = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  };

  //either both of the following happen or none happens -> use PrismaTransactions

  try {
    await db.$transaction([
      db.balances.update({
        where: {
          userId: Number(paymentInfor.userId),
        },
        data: {
          amount: {
            increment: Number(paymentInfor.amount),
          },
        },
      }),
      db.onRampTransaction.update({
        where: {
          token: paymentInfor.token,
        },
        data: {
          status: "Success",
        },
      }),
    ]);
    //the following response is MANDATORY to let hdfc server to know we got the transaction
    res.status(200).json({
      message: "captured",
    });
  } catch (e) {
    console.log(e);
    res.status(411).json({
      message: "transaction failed",
    });
  }
});

app.listen(3003, () => {
  console.log("Running webhok");
});
