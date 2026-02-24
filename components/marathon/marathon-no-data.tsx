import { Baby } from "lucide-react";

export default function MarathonNoData() {
  return (
    <div className="border border-dashed rounded text-center py-24">
      <Baby className="mx-auto mb-3 w-24 h-24 text-gray-300" />
      <h3 className="font-paperlogy text-xl mb-1 font-semibold text-gray-700">
        데이터가 없습니다.!
      </h3>
      <p className="font-anyvid text-sm text-muted-foreground">
        조건에 맞는 대회가 없습니다. 다시 검색해주세요!.
      </p>
    </div>
  );
}
