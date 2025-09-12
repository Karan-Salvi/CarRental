import { ReactNode } from "react";
import Link from "next/link";
import { BookMarked, User } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* <aside className="w-full md:w-1/4 lg:w-1/5">
          <h2 className="text-2xl font-bold text-primary mb-6">My Account</h2>
          <nav className="flex flex-col space-y-2">
            <Link href="/dashboard/bookings" className="flex items-center gap-3 p-3 rounded-lg text-muted-foreground hover:bg-slate-100 hover:text-primary transition-colors">
              <BookMarked className="w-5 h-5"/>
              <span>My Bookings</span>
            </Link>
             <Link href="#" className="flex items-center gap-3 p-3 rounded-lg text-muted-foreground hover:bg-slate-100 hover:text-primary transition-colors">
              <User className="w-5 h-5"/>
              <span>Profile</span>
            </Link>
          </nav>
        </aside> */}
        <main className="w-full md:w-3/4 lg:w-4/5 mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
