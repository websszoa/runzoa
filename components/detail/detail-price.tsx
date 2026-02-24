import { CircleDollarSign } from "lucide-react";
import type { Marathon } from "@/lib/types";

type DetailPriceProps = {
  marathon: Marathon;
};

export default function DetailPrice({ marathon }: DetailPriceProps) {
  const priceList = marathon.registration_price;
  if (!priceList || priceList.length === 0) {
    return null;
  }

  return (
    <div className="detail__block">
      <h3>
        <CircleDollarSign className="w-5 h-5 text-brand" /> 참가비
      </h3>
      <div className="price">
        {priceList.map((item, index) => {
          const key = item.distance || `항목${index}`;
          const displayValue =
            typeof item.price === "number"
              ? `${item.price.toLocaleString()}원`
              : "미정";

          return (
            <div key={key}>
              <span className="text-gray-700">{key}</span>
              <span>{displayValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
