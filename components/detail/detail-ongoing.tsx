import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

type DetailOngoingProps = {
  marathonId: string;
};

type OngoingItem = {
  id: string;
  name: string | null;
  slug: string | null;
  event_start_at: string | null;
};

export default async function DetailOngoing({
  marathonId,
}: DetailOngoingProps) {
  const supabase = await createClient();

  const { data: ongoingMarathons, error } = await supabase
    .from("marathons")
    .select("id, name, slug, event_start_at")
    .eq("registration_status", "접수중")
    .neq("id", marathonId)
    .order("event_start_at", { ascending: true })
    .limit(5);

  if (error || !ongoingMarathons?.length) {
    return null;
  }

  const list = ongoingMarathons as OngoingItem[];

  return (
    <div className="detail__block">
      <h3>
        <Calendar className="w-5 h-5 text-brand" /> 접수중인 마라톤
      </h3>
      <div className="space-y-2">
        {list.map((marathon) => (
          <Link
            key={marathon.id}
            href={`/marathon/${marathon.slug ?? marathon.id}`}
            className="block p-3 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="font-semibold text-sm text-gray-900 font-nanumNeo mb-1">
              {marathon.name ?? "-"}
            </div>
            {marathon.event_start_at && (
              <div
                className="text-xs text-gray-500 font-nanumNeo"
                suppressHydrationWarning
              >
                {formatDate(marathon.event_start_at)}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
