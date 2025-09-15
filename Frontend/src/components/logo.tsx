import Link from "next/link";
import { Car } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-foreground">
      <div className="grid size-8 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
        <Car className="h-5 w-5 text-white" />
      </div>
      {/* <span className={"text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100"}>
        RentCarsWorld
      </span> */}
    </Link>
  );
}
