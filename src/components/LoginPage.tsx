import React, { useState, useEffect } from "react";
import { Lock, User, Eye, EyeOff, ShieldAlert, ShieldCheck, AlertTriangle, KeyRound, CheckCircle2, Clock } from "lucide-react";

interface LoginPageProps {
  onLoginSuccess: (username: string) => void;
}

const VALID_USERNAME = "thor";
const VALID_PASSWORD = "thor@asgard";
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_STORAGE_KEY = "cil_auth_lockout";
const ATTEMPTS_STORAGE_KEY = "cil_auth_failed_attempts";

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inactivityNotice, setInactivityNotice] = useState<string | null>(null);

  // Initialize failed attempts, lockout state, and inactivity notices from storage
  useEffect(() => {
    try {
      const storedAttempts = parseInt(localStorage.getItem(ATTEMPTS_STORAGE_KEY) || "0", 10);
      const isLockedOut = localStorage.getItem(LOCKOUT_STORAGE_KEY) === "true";
      
      setFailedAttempts(storedAttempts);
      if (isLockedOut || storedAttempts >= MAX_FAILED_ATTEMPTS) {
        setIsLocked(true);
      }

      const notice = sessionStorage.getItem("cil_inactivity_logout_notice");
      if (notice) {
        setInactivityNotice(notice);
        sessionStorage.removeItem("cil_inactivity_logout_notice");
      }
    } catch {
      // Fallback if localStorage is restricted
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const trimmedUser = username.trim();

      if (trimmedUser === VALID_USERNAME && password === VALID_PASSWORD) {
        // Success: Clear failed attempts and log in
        localStorage.removeItem(ATTEMPTS_STORAGE_KEY);
        localStorage.removeItem(LOCKOUT_STORAGE_KEY);
        setFailedAttempts(0);
        onLoginSuccess(trimmedUser);
      } else {
        // Failed attempt
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        localStorage.setItem(ATTEMPTS_STORAGE_KEY, newAttempts.toString());

        if (newAttempts >= MAX_FAILED_ATTEMPTS) {
          setIsLocked(true);
          localStorage.setItem(LOCKOUT_STORAGE_KEY, "true");
          setErrorMessage(
            `Access permanently locked! You have exceeded the maximum limit of ${MAX_FAILED_ATTEMPTS} login attempts.`
          );
        } else {
          const remaining = MAX_FAILED_ATTEMPTS - newAttempts;
          setErrorMessage(
            `Invalid username or password. Attempt ${newAttempts} of ${MAX_FAILED_ATTEMPTS}. (${remaining} attempt${remaining === 1 ? "" : "s"} remaining before permanent lockout)`
          );
        }
      }
    }, 400);
  };

  const handleResetForDemo = () => {
    localStorage.removeItem(ATTEMPTS_STORAGE_KEY);
    localStorage.removeItem(LOCKOUT_STORAGE_KEY);
    setFailedAttempts(0);
    setIsLocked(false);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-black text-2xl shadow-xl shadow-amber-500/20 ring-4 ring-amber-400/20 mb-4">
            CIL
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            CIL MT (System) CBT Portal
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Management Trainee 2025–2026 Examination & Mock Portal
          </p>
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-amber-300 font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Authorized Candidate Access Only</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
          {/* Inactivity Alert if user was timed out */}
          {inactivityNotice && (
            <div className="mb-6 p-3.5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 text-xs flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
              <div className="flex-1">
                <span className="font-bold">Session Auto-Logged Out:</span> {inactivityNotice}
              </div>
            </div>
          )}

          {/* Security Alert Header */}
          {isLocked ? (
            <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-red-300">Account Locked Out</h3>
                  <p className="text-xs text-red-300/90 mt-1 leading-relaxed">
                    You have reached the maximum allowed limit of {MAX_FAILED_ATTEMPTS} login attempts. All further login attempts have been blocked for security.
                  </p>
                  <button
                    onClick={handleResetForDemo}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    Reset Failed Attempts (Admin / Demo Unlock)
                  </button>
                </div>
              </div>
            </div>
          ) : failedAttempts > 0 ? (
            <div className="mb-6 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="flex-1">
                <span className="font-bold">Security Notice:</span> {MAX_FAILED_ATTEMPTS - failedAttempts} of {MAX_FAILED_ATTEMPTS} attempt(s) remaining.
              </div>
            </div>
          ) : (
            <div className="mb-6 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Enter your credentials to unlock mock tests and analytics.</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  disabled={isLocked || isLoading}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isLocked || isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  disabled={isLocked || isLoading}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {errorMessage && !isLocked && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLocked || isLoading}
              className={`w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                isLocked
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                  : "bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 hover:from-amber-400 hover:to-amber-300 active:scale-[0.99] shadow-amber-500/20"
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : isLocked ? (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  <span>Access Blocked (5/5 Failed)</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sign In to Examination Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Credentials Info Footer for Authorized User */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 text-[11px] text-slate-400 space-y-1">
              <div className="text-[10px] text-slate-500 pt-1">
                Attempts limit: strictly 5 tries before lockout protection
              </div>
            </div>
          </div>
        </div>

        {/* Security Footer Note */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Coal India Limited MT Examination CBT Console • Confidential & Protected
        </p>
      </div>
    </div>
  );
};
