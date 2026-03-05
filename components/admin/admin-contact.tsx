"use client";

export default function AdminContact() {
  return (
    <div className="md:p-6 md:space-y-6 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold font-paperlogy flex items-center gap-2">
            문의 관리
          </h2>
          <p className="text-sm text-muted-foreground font-anyvid mt-1">
            사용자 문의를 확인하고 답변할 수 있습니다.
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">
            전체 문의
          </p>
          <p className="text-2xl font-semibold font-paperlogy">0</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">대기중</p>
          <p className="text-2xl font-semibold font-paperlogy text-red-600">
            0
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">처리중</p>
          <p className="text-2xl font-semibold font-paperlogy text-yellow-600">
            0
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">해결됨</p>
          <p className="text-2xl font-semibold font-paperlogy text-green-600">
            0
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">종료됨</p>
          <p className="text-2xl font-semibold font-paperlogy text-muted-foreground">
            0
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-lg overflow-hidden font-anyvid"></div>
    </div>
  );
}
