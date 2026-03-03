import Link from "next/link";
import { footerMenuItems } from "@/lib/menu";
import { APP_DESCRIPTION, APP_ENG_NAME, APP_SLOGAN } from "@/lib/constants";

export default function FooterInfo() {
  return (
    <div className="border-t border-gray-300/40 pt-6">
      <h3 className="text-xl text-brand uppercase font-black font-paperlogy mb-4">
        {APP_ENG_NAME}
      </h3>

      <p className="font-anyvid text-sm text-muted-foreground leading-5 mb-2">
        <span className="block mb-1 uline">{APP_SLOGAN}</span>
        {APP_DESCRIPTION}
      </p>

      <div className="flex items-center flex-wrap gap-3 text-sm font-anyvid text-muted-foreground">
        {footerMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1 group"
            >
              <Icon className="w-4 h-4 group-hover:text-red-500" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
