import { Button } from "@/components/ui/button";
import type { Marathon } from "@/lib/types";

type DetailRegisterProps = {
  marathon: Marathon;
};

export default function DetailRegister({ marathon }: DetailRegisterProps) {
  if (!marathon.event_site) {
    return null;
  }

  return (
    <div className="mb-8 md:mb-0">
      <Button
        asChild
        className="w-full font-paperlogy border-red-400 text-base bg-brand hover:bg-brand/90 text-white py-6"
      >
        <a href={marathon.event_site} target="_blank" rel="noopener noreferrer">
          대회 신청하기
        </a>
      </Button>
    </div>
  );
}
