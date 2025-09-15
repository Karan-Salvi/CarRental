"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Car, Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "./logo";
import { Input } from "./ui/input";
import { useDispatch, useSelector } from "react-redux";
import { logout, rehydrateAuth } from "@/store/slices/authSlice";
import { useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/cars", label: "Cars" },
  { href: "/dashboard/bookings", label: "My Bookings" },
];

export default function Header() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(rehydrateAuth());
  }, [dispatch]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <div className="grid size-8 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
            <Car className="h-5 w-5 text-white" />
          </div>
          <span
            className={
              "text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
            }
          >
            RentCarsWorld
          </span>
        </Link>
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-base font-medium transition-colors hover:text-primary",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          {user && user.role == "owner" && (
            <Link
              href="/admin/dashboard"
              className={cn(
                "text-base font-medium transition-colors hover:text-primary",
                pathname.startsWith("/admin")
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              Admin
            </Link>
          )}
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <Link href="/cars" className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cars"
              className="pl-9 bg-slate-100 border-none rounded-full h-10 w-48"
            />
          </Link>
          {user && user.role == "owner" && (
            <Button variant="outline" asChild>
              <Link href="/admin/cars/new">List cars</Link>
            </Button>
          )}
          {user ? (
            <Button onClick={() => dispatch(logout())}>Logout</Button>
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
          {/* <Button asChild>
            <Link href="/login">Logout</Link>
          </Button> */}
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] bg-background">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                <Logo />
              </div>
              <nav className="flex flex-col gap-4 p-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-base font-medium transition-colors hover:text-primary",
                      pathname === link.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/admin/dashboard"
                  className={cn(
                    "text-base font-medium transition-colors hover:text-primary",
                    pathname.startsWith("/admin")
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  Admin
                </Link>
              </nav>
              <div className="mt-auto p-4 border-t flex flex-col gap-2">
                <Button variant="outline" asChild>
                  <Link href="#">List Your Car</Link>
                </Button>

                <Button variant="primary" asChild>
                  <Link href="/login">Logout</Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
