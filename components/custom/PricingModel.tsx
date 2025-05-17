import Lookup from "@/data/Lookup";
import React from "react";

function PricingModel() {
  return (
    <div className="mt-10 grid grid-cols-1 md:grid=cols-2 lg:grid-col-3 xl:grid-cols-4">
      {Lookup.PRICING_OPTIONS.map((pricing, index) => (
        <div>
          <h2 className="text-2xl">{pricing.name}</h2>
        </div>
      ))}
    </div>
  );
}

export default PricingModel;
