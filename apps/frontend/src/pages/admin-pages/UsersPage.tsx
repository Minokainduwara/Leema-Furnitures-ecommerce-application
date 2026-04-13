import React, { useState } from "react";
import { Plus, Edit2, Trash2, Save, Users, Activity, Star } from "lucide-react";
import {
  Badge, Btn, Input, Select, Modal, ConfirmDelete,
  PageHeader, SearchBar, Avatar,
} from "../../components/ui/admin-ui/index";
import { useUsers, useModal } from "../../hooks/Usestore";
import type { User, UserFormData, UserRole, UserStatus } from "../../types";

// ─── Variant maps ─────────────────────────────────────────────────────────────

const ROLE_V:   Record<UserRole,   "default" | "purple" | "info">     = { Customer: "default", VIP: "purple", Admin: "info" };
const STATUS_V: Record<UserStatus, "success" | "danger">              = { Active: "success", Inactive: "danger" };

// ─── User Form ────────────────────────────────────────────────────────────────

interface UserFormProps {
  form:    UserFormData;
  setForm: React.Dispatch<React.SetStateAction<UserFormData>>;
}

const UserForm: React.FC<UserFormProps> = ({ form, setForm }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-3">
      <Input
        label="Full Name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        placeholder="Full name"
      />
      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        placeholder="email@example.com"
      />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <Input
        label="Phone"
        value={form.phone}
        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        placeholder="+94 77 000 0000"
      />
      <Select
        label="Role"
        value={form.role}
        onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}
        options={(["Customer", "VIP", "Admin"] as UserRole[]).map((r) => ({ value: r, label: r }))}
      />
    </div>
    <Select
      label="Status"
      value={form.status}
      onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as UserStatus }))}
      options={(["Active", "Inactive"] as UserStatus[]).map((s) => ({ value: s, label: s }))}
    />
  </div>
);

// ─── User Table Row ───────────────────────────────────────────────────────────

interface UserRowProps {
  user:     User;
  onEdit:   (u: User) => void;
  onDelete: (u: User) => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, onEdit, onDelete }) => (
  <tr className="border-b border-stone-50 hover:bg-amber-50/30 transition-colors">
    <td className="px-4 py-3">
      <div className="flex items-center gap-3">
        <Avatar initials={user.avatar} size="md" />
        <div>
          <div className="font-medium text-stone-800">{user.name}</div>
          <div className="text-xs text-stone-400">Joined {user.joined}</div>
        </div>
      </div>
    </td>
    <td className="px-4 py-3">
      <div className="text-stone-600">{user.email}</div>
      <div className="text-xs text-stone-400">{user.phone}</div>
    </td>
    <td className="px-4 py-3"><Badge variant={ROLE_V[user.role]}>{user.role}</Badge></td>
    <td className="px-4 py-3 text-stone-600">{user.orders}</td>
    <td className="px-4 py-3 font-semibold text-stone-800">${user.spent.toLocaleString()}</td>
    <td className="px-4 py-3"><Badge variant={STATUS_V[user.status]}>{user.status}</Badge></td>
    <td className="px-4 py-3">
      <div className="flex gap-1.5">
        <button onClick={() => onEdit(user)}   className="p-1.5 rounded-lg hover:bg-amber-50 text-stone-400 hover:text-amber-600"><Edit2  size={14} /></button>
        <button onClick={() => onDelete(user)} className="p-1.5 rounded-lg hover:bg-red-50   text-stone-400 hover:text-red-500">  <Trash2 size={14} /></button>
      </div>
    </td>
  </tr>
);

// ─── Users Page ───────────────────────────────────────────────────────────────

const EMPTY_FORM: UserFormData = {
  name: "", email: "", phone: "", role: "Customer", status: "Active",
};

const UsersPage: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useUsers();
  const { modal, selected, open, close }           = useModal<User>();
  const [search, setSearch]                        = useState<string>("");
  const [form,   setForm]                          = useState<UserFormData>(EMPTY_FORM);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd  = (): void => { setForm(EMPTY_FORM); open("add"); };
  const handleOpenEdit = (u: User): void => { setForm({ name: u.name, email: u.email, phone: u.phone, role: u.role, status: u.status }); open("edit", u); };
  const handleOpenDel  = (u: User): void => open("delete", u);

  const handleSave = (): void => {
    if (modal === "add") addUser(form);
    else if (selected) updateUser(selected.id, form);
    close();
  };
  const handleDelete = (): void => {
    if (selected) deleteUser(selected.id);
    close();
  };

  const summaryItems = [
    { label: "Total Users",  value: users.length,                                    Icon: Users,    color: "text-stone-700" },
    { label: "Active Users", value: users.filter((u) => u.status === "Active").length, Icon: Activity, color: "text-emerald-600" },
    { label: "VIP Members",  value: users.filter((u) => u.role === "VIP").length,    Icon: Star,     color: "text-amber-500" },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Users"
        subtitle={`${users.length} registered users`}
        action={<Btn onClick={handleOpenAdd}><Plus size={16} />Add User</Btn>}
      />

      <div className="grid grid-cols-3 gap-4">
        {summaryItems.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex items-center gap-3">
            <s.Icon size={20} className={s.color} />
            <div>
              <div className="text-xl font-bold text-stone-800">{s.value}</div>
              <div className="text-xs text-stone-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-4 border-b border-stone-100">
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users…" className="max-w-xs" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                {["User","Contact","Role","Orders","Total Spent","Status","Actions"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-stone-400 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <UserRow key={u.id} user={u} onEdit={handleOpenEdit} onDelete={handleOpenDel} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal === "add" || modal === "edit"} onClose={close} title={modal === "add" ? "Add New User" : "Edit User"}>
        <UserForm form={form} setForm={setForm} />
        <div className="flex justify-end gap-2 mt-6">
          <Btn variant="secondary" onClick={close}>Cancel</Btn>
          <Btn onClick={handleSave}><Save size={15} />{modal === "add" ? "Add User" : "Save Changes"}</Btn>
        </div>
      </Modal>

      <ConfirmDelete open={modal === "delete"} onClose={close} onConfirm={handleDelete} title="Remove User">
        <Avatar initials={selected?.avatar ?? ""} size="lg" className="mx-auto mb-2" />
        <p className="text-stone-600">Remove <strong>{selected?.name}</strong> from the platform?</p>
      </ConfirmDelete>
    </div>
  );
};

export default UsersPage;