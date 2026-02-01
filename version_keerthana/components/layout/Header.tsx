"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { clearCurrentUser, getCurrentUser } from "@/lib/currentUser";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAuthPage = pathname === "/" || pathname.startsWith("/auth");
  const isInstructor = pathname?.startsWith("/dashboard/instructor");
  const isLearner = pathname?.startsWith("/dashboard/learner");
  const isAdmin = pathname?.startsWith("/dashboard/admin");
  const isManager = pathname?.startsWith("/dashboard/manager");
  const showProfileDropdown = isInstructor || isLearner || isAdmin || isManager;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearCurrentUser();
    setProfileOpen(false);
    router.push("/auth/login");
  };

  const user = getCurrentUser();
  const displayName = user?.name ?? "User";

  return (
    <header className="bg-white border-b border-teal-100 sticky top-0 z-50">
      <div className="flex items-center justify-between h-16 px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="DigitalT3"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
        </Link>

        {!isAuthPage && (
          <div className="relative flex items-center gap-2" ref={dropdownRef}>
            {showProfileDropdown ? (
              <>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 w-10 h-10 rounded-full bg-teal-100 text-teal-700 hover:bg-teal-200 transition focus:outline-none focus:ring-2 focus:ring-teal-500"
                  aria-label="Profile menu"
                >
                  <User size={22} strokeWidth={1.5} />
                  <ChevronDown size={14} className="shrink-0" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 py-1 bg-white border border-slate-200 rounded-lg shadow-lg min-w-[180px] z-50">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-800 truncate">{displayName}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email ?? ""}</p>
                    </div>
                    <Link
                      href={
                        isInstructor
                          ? "/dashboard/instructor/settings"
                          : isLearner
                            ? "/dashboard/learner/settings"
                            : isAdmin
                              ? "/dashboard/admin/settings"
                              : "/dashboard/manager/settings"
                      }
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 w-full text-left"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : null}
          </div>
        )}
      </div>
    </header>
  );
}
