import Lookup from "@/data/Lookup";
import { lookup } from "dns";
import React, { useContext, useState } from "react";
import { Button } from "../ui/button";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { UserDetailContext } from "@/context/UserDetailContext";
import { UpdateToken } from "@/convex/users";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface PricingOption {
  name: string;
  tokens: string;
  desc: string;
  price: number;
  value: number;
}

function PricingModel() {
  const userDetailContext = useContext(UserDetailContext);
  const UpdateTokens = useMutation(api.users.UpdateToken);

  if (!userDetailContext) {
    throw new Error("Hero must be used within required providers");
  }
  const { userDetail, setUserDetail } = userDetailContext;
  const [selectedOption, setSelectedOption] = useState();

  const onPaymentSuccess = async (pricing: PricingOption) => {
    const currentTokens = userDetail?.token || 0;
    const newTokenAmount = currentTokens + Number(pricing.value);
    console.log(newTokenAmount);
    if (userDetail && userDetail._id) {
      await UpdateTokens({
        userId: userDetail._id,
        token: newTokenAmount,
      });
    } else {
      console.warn("Cannot update token: User not authenticated");
    }
  };
  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Lookup.PRICING_OPTIONS.map((pricing, index) => (
        <div
          key={index}
          className="border border-gray-700 rounded-xl p-6 flex flex-col gap-4 bg-black/70 hover:bg-black/90 transition-all duration-300 hover:border-gray-500"
        >
          <h2 className="text-3xl font-bold font-poppins">{pricing.name}</h2>
          <h2 className="text-xl md:text-2xl font-poppins font-bold">
            {pricing.tokens}
          </h2>
          <p className="text-gray-300 text-xl font-poppins">{pricing.desc}</p>
          <h2 className="font-bold text-4xl text-center mt-6 font-poppins">
            ${pricing.price}
          </h2>
          {/* <Button>Upgrade to {pricing.name}</Button> */}
          <PayPalButtons
            style={{ layout: "horizontal" }}
            disabled={!userDetail}
            onApprove={() => onPaymentSuccess(pricing)}
            onCancel={() => console.log("Payment Cancelled")}
            createOrder={(data, actions) => {
              return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [
                  {
                    amount: {
                      value: pricing.price.toString(),
                      currency_code: "USD",
                    },
                  },
                ],
              });
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default PricingModel;
