import React, { useState } from "react";
import {
  BusinessProfile,
  VatStatus,
  UserAccount,
} from "../types/profile";

export interface ProfilePageProps {
  user: UserAccount;
  initialProfile: BusinessProfile | null;
  onProfileSaved: (profile: BusinessProfile) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  initialProfile,
  onProfileSaved,
}) => {
  const [businessName, setBusinessName] = useState<string>(
    initialProfile?.businessName ?? ""
  );
  const [kraPin, setKraPin] = useState<string>(initialProfile?.kraPin ?? "");
  const [vatStatus, setVatStatus] = useState<VatStatus>(
    initialProfile?.vatStatus ?? "non-vat"
  );
  const [sector, setSector] = useState<BusinessProfile["sector"]>(
    initialProfile?.sector ?? "retail"
  );
  const [location, setLocation] = useState<string>(
    initialProfile?.location ?? ""
  );

  const isDisabled = !businessName.trim() || !location.trim();

  const handleSave = () => {
    if (isDisabled) return;
    const profile: BusinessProfile = {
      businessName: businessName.trim(),
      kraPin: kraPin.trim() || undefined,
      vatStatus,
      sector,
      location: location.trim(),
    };
    onProfileSaved(profile);
  };

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 px-4 pt-[env(safe-area-inset-top,0.75rem)]">
      <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col justify-center space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
            Hi {user.name.split(" ")[0]},
          </p>
          <h1 className="mt-1 text-xl font-semibold text-neutral-50">
            Tell us about your business
          </h1>
          <p className="mt-1 text-sm text-neutral-300">
            This powers your tax impact metrics and eTIMS readiness score.
          </p>
        </div>

        <div className="space-y-3 rounded-2xl border border-white/10 bg-neutral-900/80 p-4 text-sm">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-200">
              Business / shop name
            </label>
            <input
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none ring-emerald-500 focus:border-emerald-500 focus:ring-1"
              placeholder="E.g. Umoja Duka, CBD Electronics"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-200">
              Location (estate, town)
            </label>
            <input
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none ring-emerald-500 focus:border-emerald-500 focus:ring-1"
              placeholder="E.g. Umoja II, Nairobi"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-medium text-neutral-200">
                VAT status
              </label>
              <div className="flex gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setVatStatus("vat-registered")}
                  className={[
                    "flex-1 rounded-full border px-2 py-1.5 font-medium transition-colors",
                    vatStatus === "vat-registered"
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                      : "border-neutral-700 bg-neutral-900 text-neutral-300",
                  ].join(" ")}
                >
                  VAT
                </button>
                <button
                  type="button"
                  onClick={() => setVatStatus("non-vat")}
                  className={[
                    "flex-1 rounded-full border px-2 py-1.5 font-medium transition-colors",
                    vatStatus === "non-vat"
                      ? "border-neutral-500 bg-neutral-800 text-neutral-100"
                      : "border-neutral-700 bg-neutral-900 text-neutral-300",
                  ].join(" ")}
                >
                  Non‑VAT
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-medium text-neutral-200">
                Sector
              </label>
              <select
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-2 text-xs text-white outline-none ring-emerald-500 focus:border-emerald-500 focus:ring-1"
                value={sector}
                onChange={(e) =>
                  setSector(e.target.value as BusinessProfile["sector"])
                }
              >
                <option value="retail">Retail / Duka</option>
                <option value="wholesale">Wholesale</option>
                <option value="services">Services</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-200">
              KRA PIN (optional)
            </label>
            <input
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none ring-emerald-500 focus:border-emerald-500 focus:ring-1"
              placeholder="A0XXXXXXXXX"
              value={kraPin}
              onChange={(e) => setKraPin(e.target.value.toUpperCase())}
            />
            <p className="text-[11px] text-neutral-400">
              Used only for your own reference. This demo does not connect to
              KRA systems.
            </p>
          </div>

          <button
            type="button"
            disabled={isDisabled}
            onClick={handleSave}
            className="mt-2 w-full rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-800/60 disabled:cursor-not-allowed disabled:bg-neutral-700"
          >
            Save profile &amp; open dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;


