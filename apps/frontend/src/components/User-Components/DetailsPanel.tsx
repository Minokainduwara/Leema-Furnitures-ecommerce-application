// ============================================================
// src/components/DetailsPanel.tsx
// My Personal Details - view mode + edit mode toggle
// Props:
//   user     - UserProfile
//   onSave   - called with updated UserProfile when Save is clicked
// ============================================================
import React, { useState, useRef } from "react";
import type { UserProfile } from "../../types/dashboard.types";

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
  <div className="flex items-center gap-3">
    <label className="text-white/70 text-sm font-medium w-28 text-right shrink-0">
      {label}:
    </label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={!editable}
      className="flex-1 px-3 py-2 rounded-lg text-sm outline-none transition-all"
      style={{
        background:  editable ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)",
        border:      editable ? "1px solid rgba(125,212,196,0.5)" : "1px solid transparent",
        color:       "#fff",
        cursor:      editable ? "text" : "default",
      }}
    />
  </div>
);

const DetailsPanel: React.FC<DetailsPanelProps> = ({ user, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm]         = useState<UserProfile>({ ...user });
  const [saved, setSaved]       = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
 

  const set = (field: keyof UserProfile) => (val: string) =>
    setForm(prev => ({ ...prev, [field]: val }));

  const handleSave = () => {
    onSave(form);
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleEditToggle = () => {
    setEditMode(true);
    setForm({ ...user }); // reset to latest saved
  };

  return (
    <div className="rounded-xl p-8 h-full"
         style={{ background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)" }}>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <h2 className="text-white font-black text-2xl leading-tight"
            style={{ fontFamily: "'Georgia', serif" }}>
          My Personal<br />Details
        </h2>
        <p className="text-white/50 text-xs tracking-widest mt-1">USER ID:{user.id}</p>
      </div>

      {/* Saved banner */}
      {saved && (
        <div className="mb-6 px-4 py-2 rounded-lg text-sm font-semibold text-center"
             style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80",
                      border: "1px solid rgba(74,222,128,0.3)" }}>
          ✓ Details saved successfully!
        </div>
      )}

      {/* Two-column form */}
      <div className="grid grid-cols-2 gap-x-10 gap-y-4 mb-10">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          <InputField label="First Name"   value={form.firstName}  editable={editMode} onChange={set("firstName")} />
          <InputField label="Address"      value={form.address}    editable={editMode} onChange={set("address")} />
          <InputField label="City"         value={form.city}       editable={editMode} onChange={set("city")} />
          <InputField label="District"     value={form.district}   editable={editMode} onChange={set("district")} />
          <InputField label="Postal Code"  value={form.postalCode} editable={editMode} onChange={set("postalCode")} />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          <InputField label="Last Name"    value={form.lastName}   editable={editMode} onChange={set("lastName")} />

          {/* Profile picture upload */}
          <div className="flex items-center gap-3">
            <label className="text-white/70 text-sm font-medium w-28 text-right shrink-0">
              Add Profile<br />Picture
            </label>

            {/* Preview */}
            <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/10">
              {form.avatar ? (
                // avatar stored as data URL or image path
                <img src={form.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/50 text-xs">No image</div>
              )}
            </div>

            <div>
              <label
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer
                               ${editMode ? "hover:opacity-80" : "opacity-50 cursor-default"}`}
                style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
                onClick={() => {
                  if (editMode) fileInputRef.current?.click();
                }}
              >
                Browse
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async e => {
                  const f = e.target.files?.[0] ?? null;
                  if (!f) return;
                  // read file as data URL for preview and save
                  const reader = new FileReader();
                  reader.onload = () => {
                    const result = reader.result as string;
                    setForm(prev => ({ ...prev, avatar: result }));
                  };
                  reader.readAsDataURL(f);
                }}
              />
            </div>
          </div>

          <InputField label="E-mail" value={form.email} editable={editMode} onChange={set("email")} type="email" />
          <InputField label="TELE"         value={form.phone}      editable={editMode} onChange={set("phone")} type="tel" />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3">
        {editMode ? (
          <>
            <button
              onClick={() => { setEditMode(false); setForm({ ...user }); }}
              className="px-6 py-2.5 rounded-lg text-sm font-bold transition-all"
              style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)",
                       border: "1px solid rgba(255,255,255,0.15)" }}>
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-2.5 rounded-lg text-sm font-bold transition-all"
              style={{ background: "#22c55e", color: "#fff", border: "none" }}
              onMouseOver={e => (e.currentTarget.style.background = "#16a34a")}
              onMouseOut={e  => (e.currentTarget.style.background = "#22c55e")}> 
              💾 Save Changes
            </button>
          </>
        ) : (
          <button
            onClick={handleEditToggle}
            className="px-8 py-2.5 rounded-lg text-sm font-bold transition-all"
            style={{ background: "#22c55e", color: "#fff", border: "none" }}
            onMouseOver={e => (e.currentTarget.style.background = "#16a34a")}
            onMouseOut={e  => (e.currentTarget.style.background = "#22c55e")}>
            ✏️ Edit Mode
          </button>
        )}
      </div>
    </div>
  );
};

export default DetailsPanel;
