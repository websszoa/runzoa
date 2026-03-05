export default function AdminMember() {
  return (
    <div className="md:p-6 md:space-y-6 p-4 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold font-paperlogy flex items-center gap-2">
          회원 관리
        </h1>
        <p className="text-sm text-muted-foreground font-anyvid mt-1">
          전체 회원 목록을 확인하고 관리할 수 있습니다.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">
            전체 회원
          </p>
          <p className="text-2xl font-semibold font-paperlogy">0</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">
            활성 회원
          </p>
          <p className="text-2xl font-semibold font-paperlogy text-green-600">
            0
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">
            탈퇴 회원
          </p>
          <p className="text-2xl font-semibold font-paperlogy text-red-600">
            0
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">관리자</p>
          <p className="text-2xl font-semibold font-paperlogy text-blue-600">
            0
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-lg overflow-hidden font-anyvid"></div>
    </div>
  );
}
