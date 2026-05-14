// ============================================================
// src/components/DetailsPanel.tsx
// My Personal Details - view mode + edit mode toggle
// + Change Password feature (only in edit mode)
// ============================================================
import React, { useState, useRef } from "react";
// import { UserProfile } from "../types/dashboard.types.ts";
import type { UserProfile } from "@/types/dashboard.types";

interface DetailsPanelProps {
  user: UserProfile;
  onSave: (updated: UserProfile) => void;
}

const InputField: React.FC<{
  label: string;
  value: string;
  editable: boolean;
  onChange: (v: string) => void;
  type?: string;
}> = ({ label, value, editable, onChange, type = "text" }) => (
  <div className="flex items-center gap-3 bg-gray-200">
    <label className="text-black/70 text-sm font-medium w-28 text-right shrink-0">
      {label}:
    </label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={!editable}
      className="flex-1 px-3 py-2 rounded-lg text-sm outline-none transition-all"
      style={{
        background: editable ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)",
        border: editable
          ? "1px solid rgba(125,212,196,0.5)"
          : "1px solid transparent",
        color: "#fff",
        cursor: editable ? "text" : "default",
      }}
    />
  </div>
);

const DetailsPanel: React.FC<DetailsPanelProps> = ({ user, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<UserProfile>({ ...user });
  const [saved, setSaved] = useState(false);

  // password state
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const set = (field: keyof UserProfile) => (val: string) =>
    setForm(prev => ({ ...prev, [field]: val }));

  const setPassword = (field: keyof typeof passwords) => (val: string) =>
    setPasswords(prev => ({ ...prev, [field]: val }));

  const handleSave = () => {
    // password validation
    if (
      passwords.currentPassword ||
      passwords.newPassword ||
      passwords.confirmPassword
    ) {
      if (passwords.newPassword !== passwords.confirmPassword) {
        alert("New passwords do not match");
        return;
      }

      if (passwords.newPassword.length < 6) {
        alert("Password must be at least 6 characters");
        return;
      }

      // TODO: connect to backend
      console.log("Password change request:", passwords);
    }

    onSave(form);

    setEditMode(false);
    setSaved(true);

    // reset passwords
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setTimeout(() => setSaved(false), 2500);
  };

  const handleEditToggle = () => {
    setEditMode(true);
    setForm({ ...user });
  };

  return (
    <div
      className="rounded-xl p-8 h-full"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <h2
          className="text-black font-black text-2xl leading-tight"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          My Personal <br /> Details
        </h2>
        <p className="text-black/50 text-xs tracking-widest mt-1">
          USER ID:{user.id}
        </p>
      </div>

      {/* Saved banner */}
      {saved && (
        <div
          className="mb-6 px-4 py-2 rounded-lg text-sm font-semibold text-center"
          style={{
            background: "rgba(74,222,128,0.15)",
            color: "#4ade80",
            border: "1px solid rgba(74,222,128,0.3)",
          }}
        >
          ✓ Details saved successfully!
        </div>
      )}

      {/* Form */}
      <div className="grid grid-cols-2 gap-x-10 gap-y-4 mb-10">
        {/* Left */}
        <div className="flex flex-col  gap-4">
          <InputField label="First Name" value={form.firstName} editable={editMode} onChange={set("firstName")} />
          <InputField label="Address" value={form.address} editable={editMode} onChange={set("address")} />
          <InputField label="City" value={form.city} editable={editMode} onChange={set("city")} />
          <InputField label="District" value={form.district} editable={editMode} onChange={set("district")} />
          <InputField label="Postal Code" value={form.postalCode} editable={editMode} onChange={set("postalCode")} />
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4">
          <InputField label="Last Name" value={form.lastName} editable={editMode} onChange={set("lastName")} />

          {/* Avatar */}
          <div className="flex items-center gap-3">
            <label className="text-black/70 text-sm font-medium w-28 text-right shrink-0">
              Profile Pic
            </label>

            <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/10">
              {form.avatar ? (
                <img src={form.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-/50 text-xs">
                  No image
                </div>
              )}
            </div>

            <div>
              <label
                className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                  editMode ? "hover:opacity-80" : "opacity-50"
                }`}
                style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
                onClick={() => editMode && fileInputRef.current?.click()}
              >
                Browse
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    setForm(prev => ({ ...prev, avatar: reader.result as string }));
                  };
                  reader.readAsDataURL(f);
                }}
              />
            </div>
          </div>

          <InputField label="E-mail" value={form.email} editable={editMode} onChange={set("email")} type="email" />
          <InputField label="TELE" value={form.phone} editable={editMode} onChange={set("phone")} type="tel" />
        </div>
      </div>

      {/* 🔐 Change Password Section */}
      {editMode && (
        <div className="mt-6 border-t border-white/10 pt-6">
          <h3 className="text-black font-semibold mb-4">Change Password</h3>

          <div className="flex flex-col gap-4">
            <InputField label="Current" value={passwords.currentPassword} editable={true} onChange={setPassword("currentPassword")} type="password" />
            <InputField label="New" value={passwords.newPassword} editable={true} onChange={setPassword("newPassword")} type="password" />
            <InputField label="Confirm" value={passwords.confirmPassword} editable={true} onChange={setPassword("confirmPassword")} type="password" />
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-8">
        {editMode ? (
          <>
            <button
              onClick={() => {
                setEditMode(false);
                setForm({ ...user });
              }}
              className="px-6 py-2.5 rounded-lg text-sm font-bold"
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="px-8 py-2.5 rounded-lg text-sm font-bold"
              style={{ background: "#22c55e", color: "#fff" }}
            >
              💾 Save Changes
            </button>
          </>
        ) : (
          <button
            onClick={handleEditToggle}
            className="px-8 py-2.5 rounded-lg text-sm font-bold"
            style={{ background: "#22c55e", color: "#fff" }}
          >
            Edit Mode
          </button>
        )}
      </div>
    </div>
  );
};

export default DetailsPanel;