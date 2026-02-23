import Link from "next/link";
import { APP_ENG_NAME } from "@/lib/constants";

export default function HeaderLeft() {
  return (
    <h1>
      <Link
        href={"/"}
        className="text-2xl font-black uppercase font-paperlogy text-brand mb-4"
      >
        {APP_ENG_NAME}
      </Link>
    </h1>
  );
}
