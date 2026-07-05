import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { User, Lock } from "lucide-react";
import { userApi, type UserProfile } from "../../utils/userApi";

export default function ProfilePanel() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const data = await userApi.getProfile();
    setProfile(data);
    setForm(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    const ok = await userApi.updateProfile(form);
    setSaving(false);
    if (ok) {
      setProfile(form);
      setEditMode(false);
      toast.success("Profile updated successfully");
    } else {
      toast.error("Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setChangingPassword(true);
    const ok = await userApi.changePassword(currentPassword, newPassword);
    setChangingPassword(false);
    if (ok) {
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error("Failed to change password");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile || !form) {
    return (
      <p className="text-stone-500 text-center py-8">
        Could not load profile. Please try again later.
      </p>
    );
  }

  const field = (label: string, key: keyof UserProfile, type = "text") => (
    <div>
      <label className="block text-sm font-medium text-stone-600 mb-1">{label}</label>
      <input
        type={type}
        value={(form[key] as string) ?? ""}
        disabled={!editMode}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className={`w-full px-3 py-2 rounded-lg border text-sm transition ${
          editMode
            ? "border-amber-300 bg-white focus:ring-2 focus:ring-amber-200 outline-none"
            : "border-stone-200 bg-stone-50 text-stone-700"
        }`}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-stone-100 p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
            <User size={28} className="text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-800">{profile.name || "Your Profile"}</h2>
            <p className="text-stone-500 text-sm">{profile.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field("Full Name", "name")}
          {field("Email", "email", "email")}
          {field("Phone", "phoneNumber", "tel")}
          {field("Address", "address")}
          {field("City", "city")}
          {field("District", "district")}
          {field("Postal Code", "postalCode")}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          {editMode ? (
            <>
              <button
                onClick={() => {
                  setEditMode(false);
                  setForm(profile);
                }}
                className="px-5 py-2 rounded-lg border border-stone-300 text-stone-600 text-sm font-semibold hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="px-5 py-2 rounded-lg bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-100 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={18} className="text-stone-600" />
          <h3 className="font-semibold text-stone-800">Change Password</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="px-3 py-2 rounded-lg border border-stone-200 text-sm focus:ring-2 focus:ring-amber-200 outline-none"
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="px-3 py-2 rounded-lg border border-stone-200 text-sm focus:ring-2 focus:ring-amber-200 outline-none"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="px-3 py-2 rounded-lg border border-stone-200 text-sm focus:ring-2 focus:ring-amber-200 outline-none"
          />
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleChangePassword}
            disabled={changingPassword || !currentPassword || !newPassword}
            className="px-5 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60"
          >
            {changingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
