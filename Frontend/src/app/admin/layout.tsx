"use client";
import { useState, useEffect, type ReactNode } from "react";
import {
  Home,
  Car,
  BookMarked,
  ChevronsRight,
  Moon,
  Sun,
  Settings,
  HelpCircle,
  LogOut,
  LayoutDashboard,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/components/logo";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    if (lastSegment === "admin") return "Dashboard";

    let title = lastSegment.replace("-", " ");

    if (segments.includes("cars") && lastSegment === "cars")
      return "Manage Cars";
    if (segments.includes("cars") && lastSegment === "new")
      return "Add New Car";
    if (segments.includes("bookings")) return "Manage Bookings";
    if (segments.includes("dashboard")) return "Dashboard";

    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  const getPageDescription = () => {
    const title = getPageTitle();
    switch (title.toLowerCase()) {
      case "dashboard":
        return "Welcome back to your dashboard";
      case "manage cars":
        return "View all listed cars, update their details, or remove them from the booking platform.";
      case "add new car":
        return "Fill in the details to list a new car for booking.";
      case "manage bookings":
        return "View and manage all booking requests from users.";
      default:
        return "Welcome back to your dashboard";
    }
  };

  return (
    <div className={`flex min-h-screen w-full ${isDark ? "dark" : ""}`}>
      <div className="flex w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <Sidebar />
        <div className="flex-1 bg-gray-50 dark:bg-gray-950 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 capitalize">
                {getPageTitle()}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {getPageDescription()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDark(!isDark)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                {isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/cars", label: "Manage Cars", icon: Car },
    { href: "/admin/cars/new", label: "Add Car", icon: PlusCircle },
    { href: "/admin/bookings", label: "Manage Bookings", icon: BookMarked },
  ];

  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${
        open ? "w-64" : "w-16"
      } border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 shadow-sm flex flex-col`}
    >
      <div className="flex-1">
        <TitleSection open={open} />

        <div className="space-y-1 mb-8">
          {menuItems.map((item) => (
            <Option
              key={item.href}
              Icon={item.icon}
              title={item.label}
              href={item.href}
              selected={
                pathname === item.href ||
                (pathname.startsWith(item.href) &&
                  item.href !== "/admin/dashboard")
              }
              open={open}
            />
          ))}
        </div>

        {open && (
          <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-1">
            <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Account
            </div>
            <Option
              Icon={Settings}
              title="Settings"
              href="#"
              selected={false}
              open={open}
            />
            <Option
              Icon={HelpCircle}
              title="Help & Support"
              href="#"
              selected={false}
              open={open}
            />
            <Option
              Icon={LogOut}
              title="Logout"
              href="/login"
              selected={false}
              open={open}
            />
          </div>
        )}
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </nav>
  );
};

const Option = ({ Icon, title, selected, open, href }: any) => {
  return (
    <Link
      href={href}
      className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 ${
        selected
          ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 shadow-sm border-l-2 border-blue-500"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
      }`}
    >
      <div className="grid h-full w-12 place-content-center">
        <Icon className="h-4 w-4" />
      </div>

      {open && (
        <span
          className={`text-sm font-medium transition-opacity duration-200 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        >
          {title}
        </span>
      )}
    </Link>
  );
};

const TitleSection = ({ open }: any) => {
  return (
    <div className="mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
      <div className="flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
        <div className="flex items-center gap-3">
          <Logo />
          {open && (
            <div
              className={`transition-opacity duration-200 ${
                open ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="flex items-center gap-2">
                <div>
                  <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Richard Sanford
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ToggleClose = ({ open, setOpen }: any) => {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="border-t border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 w-full"
    >
      <div className="flex items-center p-3">
        <div className="grid size-10 place-content-center">
          <ChevronsRight
            className={`h-4 w-4 transition-transform duration-300 text-gray-500 dark:text-gray-400 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
        {open && (
          <span
            className={`text-sm font-medium text-gray-600 dark:text-gray-300 transition-opacity duration-200 ${
              open ? "opacity-100" : "opacity-0"
            }`}
          >
            Hide
          </span>
        )}
      </div>
    </button>
  );
};
