"use client";

import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { createOnRampTransaction } from "../app/lib/actions/createOnRampTransaction";

const SUPPORTED_BANKS = [
  {
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com",
  },
  {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/",
  },
];

export const AddMoney = () => {
  const [redirectURL, setRedirectURL] = useState(
    SUPPORTED_BANKS[0]?.redirectUrl
  );
  const [amount, setAmount] = useState(0);
  const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");
  return (
    <Card title="Add Money">
      <div className="w-full">
        <TextInput
          label={"Amount"}
          placeholder={"Amount"}
          onChange={(value) => {
            setAmount(Number(value));
          }}
        />

        <div>Bank</div>
        <Select
          onSelect={(value) => {
            setRedirectURL(
              SUPPORTED_BANKS.find((x) => x.name === value)?.redirectUrl || ""
            );
            setProvider(
              SUPPORTED_BANKS.find((x) => x.name === value)?.name || ""
            );
          }}
          options={SUPPORTED_BANKS.map((bank) => ({
            key: bank.name,
            value: bank.name,
          }))}
        />
        <div className="flex justify-center pt-4">
          <Button
            onClick={async () => {
              await createOnRampTransaction(amount, provider);
              window.location.href = redirectURL || "";
            }}
          >
            Add Money
          </Button>
        </div>
      </div>
    </Card>
  );
};
