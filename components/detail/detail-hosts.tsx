import { FerrisWheel } from "lucide-react";
import type { Marathon } from "@/lib/types";

type DetailHostsProps = {
  marathon: Marathon;
};

export default function DetailHosts({ marathon }: DetailHostsProps) {
  if (!marathon.hosts?.souvenir || marathon.hosts.souvenir.length === 0) {
    return null;
  }

  return (
    <div className="detail__block">
      <h3>
        <FerrisWheel className="w-5 h-5 text-brand" /> 기념품
      </h3>
      <div>
        <p className="text-sm text-gray-700 rounded py-3 px-4 bg-gray-50 hover:bg-gray-100">
          {marathon.hosts.souvenir}
        </p>
        {/* 기념품 이미지 */}
      </div>
    </div>
  );
}
