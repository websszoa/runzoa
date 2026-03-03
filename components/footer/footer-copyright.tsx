import { APP_COPYRIGHT } from "@/lib/constants";
import { Heart } from "lucide-react";

export default function FooterCopyright() {
  return (
    <div className="border-t border-gray-300/40 my-6 pt-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-muted-foreground font-nanumNeo">
        <div className="text-xs">{APP_COPYRIGHT}</div>
        <div className="flex items-center gap-2 text-xs">
          <span>Made with</span>
          <Heart className="h-4 w-4" />
          <span>for Runners</span>
        </div>
      </div>
    </div>
  );
}
