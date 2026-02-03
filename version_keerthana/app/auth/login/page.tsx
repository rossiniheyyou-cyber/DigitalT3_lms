"use client";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { setCurrentUser, getNameFromEmail } from "@/lib/currentUser";

export default function LoginPage() {

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [savedEmails, setSavedEmails] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
  
    const users = JSON.parse(localStorage.getItem("users") || "[]");
  
    // Step 1: Check email existence
    const existingUser = users.find(
      (u: { email: string; password: string; firstName?: string }) =>
        u.email === email
    );
  
    if (!existingUser) {
      setError("No account found with this email");
      return;
    }
  
    // Step 2: Check password
    if (existingUser.password !== password) {
      setError("Incorrect password");
      return;
    }
  
    // Step 3: Successful login
    let emails = [...savedEmails];
    if (!emails.includes(email)) {
      emails.push(email);
      localStorage.setItem("loggedEmails", JSON.stringify(emails));
      setSavedEmails(emails);
    }
  
    const name = existingUser.firstName ?? getNameFromEmail(email);
    setCurrentUser({ name, email });
  
    // Role-based routing
    if (email === "admin@digitalt3.com") router.push("/dashboard/admin");
    else if (email === "instructor@digitalt3.com") router.push("/dashboard/instructor");
    else if (email === "manager@digitalt3.com") router.push("/dashboard/manager");
    else router.push("/dashboard/learner");
  };
  
  const handleForgotPassword = () => {
    if (!forgotEmail) {
      setForgotMessage("Please enter your email");
      return;
    }
  
    const users = JSON.parse(localStorage.getItem("users") || "[]");
  
    const user = users.find(
      (u: { email: string; password: string }) => u.email === forgotEmail
    );
  
    if (!user) {
      setForgotMessage("No account found with this email");
      return;
    }
  
    // Demo-only behavior
    setForgotMessage(`Your password is: ${user.password}`);
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008080] pr-12"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
              <p
               className="text-sm text-right text-[#008080] cursor-pointer hover:underline"
               onClick={() => {
               setShowForgot(true);
               setForgotMessage("");
               }}
              >
              Forgot password?
              </p>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
            {showPassword ? (
            <EyeSlashIcon className="w-5 h-5" />
            ) : (
           <EyeIcon className="w-5 h-5" />
            )}
              </button>
          </div>


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

          {showForgot && (
            <div className="absolute inset-0 bg-white rounded-2xl p-6 flex flex-col justify-center z-20">
            <h2 className="text-xl font-semibold text-slate-900 mb-2 text-center">
            Forgot Password
            </h2>

            <p className="text-slate-600 text-sm text-center mb-4">
             Enter your registered email
            </p>

            <input
              type="email"
              placeholder="your.email@digitalt3.com"
              value={forgotEmail}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForgotEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#008080] mb-3"
            />

            {forgotMessage && (
            <p className="text-sm text-center text-slate-700 mb-3">
             {forgotMessage}
            </p>
            )}

           <button
             onClick={handleForgotPassword}
             className="w-full bg-[#008080] text-white py-3 rounded-xl font-medium hover:bg-[#006666] transition mb-2"
            >
            Get Password
            </button>

           <button
             onClick={() => setShowForgot(false)}
             className="text-sm text-[#008080] hover:underline"
           >
           Back to Login
           </button>
          </div>
          )}

        </div>
    </div>
  );
}