import React, { useState } from "react";
import { UserAccount } from "../types/profile";
import Logo from "../components/ui/Logo";

export interface AuthPageProps {
  onAuthenticated: (user: UserAccount) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthenticated }) => {
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("07");
  const [email, setEmail] = useState<string>("");

  const handleContinue = () => {
    if (!name.trim() || phone.trim().length < 9) return;

    const user: UserAccount = {
      id: `user-${Date.now().toString(36)}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
    };

    onAuthenticated(user);
  };

  const isDisabled = !name.trim() || phone.trim().length < 9;

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 px-4 pt-[env(safe-area-inset-top,0.75rem)]">
      <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col justify-center space-y-6">
        <div className="flex items-center justify-between">
          <Logo withWordmark size={40} />
          <span className="rounded-full bg-emerald-600/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
            Free beta
          </span>
        </div>

        <div>
          <h1 className="text-xl font-semibold text-neutral-50">
            Set up your duka workspace
          </h1>
          <p className="mt-1 text-sm text-neutral-300">
            No KRA login needed. Just tell us who you are so we can attach
            M‑Pesa and eTIMS metrics to your shop.
          </p>
        </div>

        <div className="space-y-3 rounded-2xl border border-white/10 bg-neutral-900/80 p-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-200">
              Your name
            </label>
            <input
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none ring-emerald-500 focus:border-emerald-500 focus:ring-1"
              placeholder="Owner or manager name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-200">
              M‑Pesa phone number
            </label>
            <input
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none ring-emerald-500 focus:border-emerald-500 focus:ring-1"
              placeholder="07xx xxx xxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <p className="text-[11px] text-neutral-400">
              Used for STK push simulations only. No real charges.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-200">
              Email (optional)
            </label>
            <input
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none ring-emerald-500 focus:border-emerald-500 focus:ring-1"
              placeholder="For reports and backups"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="button"
            disabled={isDisabled}
            onClick={handleContinue}
            className="mt-2 w-full rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-800/60 disabled:cursor-not-allowed disabled:bg-neutral-700"
          >
            Continue to business profile
          </button>

          <p className="mt-2 text-[11px] text-neutral-500">
            This is a local‑only demo login. Details are stored on this device
            so anyone in the shop can reopen your workspace.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;


