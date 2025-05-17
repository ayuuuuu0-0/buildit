"use client";
import Header from "@/components/custom/header";
import Lookup from "@/data/Lookup";
import React, { useContext, useEffect, useState } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import PricingModel from "@/components/custom/PricingModel";

const pricing = () => {
  const userDetailContext = useContext(UserDetailContext);
  if (!userDetailContext) {
    throw new Error("Hero must be used within required providers");
  }
  const { userDetail, setUserDetail } = userDetailContext;
  return (
    <>
      <Header />
      <div className="fixed top-0 left-0 right-0 pt-32 text-center w-full p-10 md:px-32 lg:px-4">
        <h2 className="font-poppins font-bold text-5xl inline-block mx-auto">
          Pricing
        </h2>
        <p className="text-gray-300 max-w-xl text-center mt-4 mx-auto font-poppins">
          {Lookup.PRICING_DESC}
        </p>

        <div className="p-5 border rounded-xl bg-black max-w-2xl mx-auto mt-8">
          <div className="flex items-center justify-between">
            {/* Left side: Token count */}
            <div className="flex items-baseline">
              <span className="font-bold text-3xl font-poppins mr-2">
                {userDetail?.token || 0}
              </span>
              <span className="font-poppins font-medium text-gray-300">
                Tokens left
              </span>
            </div>

            {/* Right side: Upgrade info */}
            <div className="text-right">
              <h3 className="font-medium text-gray-200 font-poppins">
                Need more tokens?
              </h3>
              <p className="text-medium text-gray-300 font-poppins">
                Upgrade your plan below
              </p>
            </div>
          </div>
        </div>
        <PricingModel />
      </div>
    </>
  );
};
export default pricing;
