import React, { useState, useEffect } from "react";
import { Save, Camera, Lock, Check, AlertCircle } from "lucide-react";
import {
  Badge,
  Btn,
  Input,
  Textarea,
  Avatar,
  PageHeader,
} from "../../components/ui/admin-ui/index";
import type { ProfileTab } from "../../types";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  role: string;
  address: string;
  bio: string;
  avatar: string;
}

// ─────────────────────────────────────────────────────────────
// API CONFIG
// ─────────────────────────────────────────────────────────────

const BASE = "http://localhost:8080/api/users";

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: authHeaders(),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Request failed");
  }

  return res.json();
}

// ─────────────────────────────────────────────────────────────
// PROFILE TAB
// ─────────────────────────────────────────────────────────────

interface ProfileInfoTabProps {
  profile: ProfileData;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
}

const ProfileInfoTab: React.FC<ProfileInfoTabProps> = ({
  profile,
  setProfile,
}) => {
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      await fetch(`${BASE}/me`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          bio: profile.bio,
        }),
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={profile.name}
          onChange={(e) =>
            setProfile((p) => ({ ...p, name: e.target.value }))
          }
        />
        <Input
          label="Email Address"
          type="email"
          value={profile.email}
          onChange={(e) =>
            setProfile((p) => ({ ...p, email: e.target.value }))
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Phone Number"
          value={profile.phone}
          onChange={(e) =>
            setProfile((p) => ({ ...p, phone: e.target.value }))
          }
        />
        <Input label="Role" value={profile.role} disabled />
      </div>

      <Input
        label="Address"
        value={profile.address}
        onChange={(e) =>
          setProfile((p) => ({ ...p, address: e.target.value }))
        }
      />

      <Textarea
        label="Bio"
        value={profile.bio}
        onChange={(e) =>
          setProfile((p) => ({ ...p, bio: e.target.value }))
        }
      />

      <div className="flex items-center gap-3 pt-2">
        <Btn onClick={handleSave}>
          {saved ? (
            <>
              <Check size={15} /> Saved!
            </>
          ) : (
            <>
              <Save size={15} /> Save Changes
            </>
          )}
        </Btn>

        {saved && (
          <span className="text-sm text-emerald-600 font-medium">
            Profile updated successfully
          </span>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// SECURITY TAB
// ─────────────────────────────────────────────────────────────

const SecurityTab: React.FC = () => {
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const mismatch =
    passwords.newPass &&
    passwords.confirm &&
    passwords.newPass !== passwords.confirm;

  const canSubmit =
    passwords.current &&
    passwords.newPass &&
    passwords.newPass === passwords.confirm;

  const handleChangePassword = async () => {
    try {
      await fetch(`${BASE}/change-password`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.newPass,
        }),
      });

      alert("Password updated successfully");

      setPasswords({
        current: "",
        newPass: "",
        confirm: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to change password");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 space-y-4">
      <h3 className="font-semibold text-stone-800 mb-2">
        Change Password
      </h3>

      <Input
        label="Current Password"
        type="password"
        value={passwords.current}
        onChange={(e) =>
          setPasswords((p) => ({ ...p, current: e.target.value }))
        }
      />

      <Input
        label="New Password"
        type="password"
        value={passwords.newPass}
        onChange={(e) =>
          setPasswords((p) => ({ ...p, newPass: e.target.value }))
        }
      />

      <Input
        label="Confirm New Password"
        type="password"
        value={passwords.confirm}
        onChange={(e) =>
          setPasswords((p) => ({ ...p, confirm: e.target.value }))
        }
      />

      {mismatch && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={12} /> Passwords do not match
        </p>
      )}

      <Btn disabled={!canSubmit} onClick={handleChangePassword}>
        <Lock size={15} /> Update Password
      </Btn>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────

const INITIAL_PROFILE: ProfileData = {
  name: "Leema Admin",
  email: "admin@leema.lk",
  phone: "+94 11 234 5678",
  role: "Super Admin",
  address: "42 Galle Road, Colombo 03, Sri Lanka",
  bio: "Managing Leema Furniture's digital presence and e-commerce operations.",
  avatar: "LA",
};

const TABS: Array<[ProfileTab, string]> = [
  ["profile", "Profile Info"],
  ["security", "Security"],
];

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);
  const [tab, setTab] = useState<ProfileTab>("profile");

  // LOAD PROFILE FROM BACKEND
  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiFetch<any>(`${BASE}/me`);

        setProfile({
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          address: data.address || "",
          bio: data.bio || "",
          avatar: data.name?.charAt(0) || "U",
        });
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-5 max-w-2xl">
      <PageHeader
        title="My Profile"
        subtitle="Manage your account information and security"
      />

      {/* Avatar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 flex items-center gap-5">
        <div className="relative">
          <Avatar initials={profile.avatar} size="lg" className="rounded-2xl" />
          <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-stone-800 rounded-lg flex items-center justify-center text-white shadow-md">
            <Camera size={13} />
          </button>
        </div>

        <div>
          <div className="text-lg font-bold text-stone-800">
            {profile.name}
          </div>
          <div className="text-sm text-stone-500">{profile.email}</div>
          <Badge variant="info" className="mt-1">
            {profile.role}
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map(([v, l]) => (
          <button
            key={v}
            onClick={() => setTab(v)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${
                tab === v
                  ? "bg-stone-800 text-white"
                  : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
              }`}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <ProfileInfoTab profile={profile} setProfile={setProfile} />
      )}
      {tab === "security" && <SecurityTab />}
    </div>
  );
};

export default ProfilePage;