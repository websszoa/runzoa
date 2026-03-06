import { Calendar, MapPin, Clock, Users, Cookie } from "lucide-react";
import type { Marathon } from "@/lib/types";
import {
  formatDate,
  formatDateWithWeekday,
  formatTimeToKorean,
  getRegistrationTextColor,
} from "@/lib/utils";

type DetailInfoProps = {
  marathon: Marathon;
};

export default function DetailInfo({ marathon }: DetailInfoProps) {
  const eventStart = formatDateWithWeekday(marathon.event_start_at);
  const eventEnd = marathon.event_end_at
    ? formatDate(marathon.event_end_at)
    : null;
  const startTime = formatTimeToKorean(marathon.event_start_at);
  const status = marathon.registration_status ?? "접수대기";
  const regStart = marathon.registration_start_at
    ? formatDate(marathon.registration_start_at)
    : null;
  const regEnd = marathon.registration_end_at
    ? formatDate(marathon.registration_end_at)
    : null;
  const scale =
    marathon.event_scale != null && marathon.event_scale > 100
      ? `${marathon.event_scale.toLocaleString("ko-KR")}명`
      : "미정";

  return (
    <div className="detail__block">
      <h3>
        <Cookie className="w-5 h-5 text-red-600" /> 대회 정보
      </h3>
      <div className="grid md:grid-cols-2 gap-2 md:gap-4">
        {/* 대회 날짜 */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <Calendar className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-gray-600 mb-1">대회 날짜</p>
            <p
              className="font-bold text-gray-900"
              suppressHydrationWarning
            >
              {eventStart}
              {eventEnd && eventEnd !== "-" ? ` ~ ${eventEnd}` : ""}
            </p>
            {startTime && (
              <p
                className="text-xs text-gray-600 mt-1 leading-relaxed"
                suppressHydrationWarning
              >
                시작시간 : {startTime}
              </p>
            )}
          </div>
        </div>

        {/* 장소 */}
        <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
          <MapPin className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-gray-600 mb-1">장소</p>
            <p className="font-bold text-gray-900">
              {marathon.location?.place}
            </p>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              {marathon.location?.country}, {marathon.location?.region}
            </p>
          </div>
        </div>

        {/* 접수 상태 */}
        <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <Clock className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">접수 상태</p>
            <p className={`font-bold ${getRegistrationTextColor(status)}`}>
              {status}
            </p>
            {regStart && (
              <p
                className="text-xs text-gray-600 mt-1 leading-relaxed"
                suppressHydrationWarning
              >
                {regStart}
                {regEnd ? ` ~ ${regEnd}` : ""}
              </p>
            )}
          </div>
        </div>

        {/* 모집 규모 */}
        <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <Users className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-gray-600 mb-1">모집 규모</p>
            <p
              className="font-bold text-gray-900"
              suppressHydrationWarning
            >
              {scale}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
