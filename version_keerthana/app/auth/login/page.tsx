"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { setCurrentUser, getNameFromEmail } from "@/lib/currentUser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [savedEmails, setSavedEmails] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load previously used emails from localStorage
  useEffect(() => {
    const emails = JSON.parse(localStorage.getItem("loggedEmails") || "[]");
    setSavedEmails(emails);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    // Save email if not already in localStorage
    let emails = [...savedEmails];
    if (!emails.includes(email)) {
      emails.push(email);
      localStorage.setItem("loggedEmails", JSON.stringify(emails));
      setSavedEmails(emails);
    }

    // Set current user (name from signup "users" or derived from email)
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const signedUpUser = users.find((u: { email: string; firstName?: string }) => u.email === email);
    const name = signedUpUser?.firstName ?? getNameFromEmail(email);
    setCurrentUser({ name, email });

    // Role-based routing (mock)
    if (email === "admin@digitalt3.com") router.push("/dashboard/admin");
    else if (email === "instructor@digitalt3.com") router.push("/dashboard/instructor");
    else if (email === "manager@digitalt3.com") router.push("/dashboard/manager");
    else router.push("/dashboard/learner");
  };

  const selectEmail = (selectedEmail: string) => {
    setEmail(selectedEmail);
    setShowDropdown(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-sm relative">
          
          <h1 className="text-2xl font-semibold text-slate-900 mb-2 text-center">
            Welcome Back
          </h1>
          <p className="text-slate-600 text-center mb-6">
            Login to continue learning
          </p>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <div className="space-y-4 relative">
            {/* Email input with custom dropdown */}
            <div className="relative" ref={dropdownRef}>
              <input
                type="email"
                name="email"
                autoComplete="off"
                placeholder="your.email@digitalt3.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008080]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setShowDropdown(true)}
              />
              {showDropdown && savedEmails.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-slate-300 rounded-md mt-1 shadow-lg max-h-48 overflow-y-auto">
                  {savedEmails
                    .filter((e) => e.toLowerCase().includes(email.toLowerCase()))
                    .map((e) => (
                      <div
                        key={e}
                        onClick={() => selectEmail(e)}
                        className="px-4 py-2 cursor-pointer hover:bg-slate-100"
                      >
                        {e}
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Password input */}
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008080]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-[#008080] text-white py-3 rounded-xl text-lg font-medium hover:bg-[#006666] transition"
            >
              Login
            </button>
          </div>

          <p className="text-slate-600 text-sm text-center mt-6">
            Don’t have an account?{" "}
            <span
              onClick={() => router.push("/")}
              className="text-[#008080] font-medium cursor-pointer hover:underline"
            >
              Create account
            </span>
          </p>
        </div>
    </div>
  );
}
