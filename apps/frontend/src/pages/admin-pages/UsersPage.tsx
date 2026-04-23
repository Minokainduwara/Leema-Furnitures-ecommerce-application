import { useState } from "react";
import { Plus, Edit2, Trash2, Save } from "lucide-react";
import type { User, UserFormData } from "../../types";
import { useUsers } from "../../hooks/Usestore";
import { useModal } from "../../hooks/Usestore";
import { Input, Select, Textarea } from "../../components/ui/admin-ui";
import { Button } from "../../components/ui/button";
import Modal from "../../components/ui/Modals";
import ConfirmDelete from "../../components/ui/ConfirmDelete";

const USER_ROLES = [
  { value: "Customer", label: "Customer" },
  { value: "Seller", label: "Seller" },
  { value: "Admin", label: "Admin" },
  { value: "Manager", label: "Manager" },
];

const USER_STATUS = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

// ─── User Form Component ──────────────────────────────────────────────────────

interface UserFormProps {
  form: UserFormData;
  setForm: (form: UserFormData) => void;
}

const UserForm: React.FC<UserFormProps> = ({ form, setForm }) => {
  return (
    <div className="space-y-4">
      <Input
        label="Full Name"
        value={form.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setForm({ ...form, name: e.target.value })
        }
        placeholder="e.g. John Doe"
      />

      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setForm({ ...form, email: e.target.value })
        }
        placeholder="e.g. john@example.com"
      />

      <Input
        label="Phone"
        type="tel"
        value={form.phone || ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setForm({ ...form, phone: e.target.value })
        }
        placeholder="e.g. +1234567890"
      />

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Role"
          value={form.role}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setForm({ ...form, role: e.target.value as any })
          }
          options={USER_ROLES}
        />
        <Select
          label="Status"
          value={form.status}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setForm({ ...form, status: e.target.value as any })
          }
          options={USER_STATUS}
        />
      </div>
    </div>
  );
};

// ─── User Card Component ──────────────────────────────────────────────────────

interface UserCardProps {
  user: User;
  onEdit: (u: User) => void;
  onDelete: (u: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 hover:shadow-md transition-all">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold">
        {user.name.charAt(0).toUpperCase()}
      </div>
      <div>
        <div className="font-semibold text-stone-800">{user.name}</div>
        <div className="text-xs text-stone-600">{user.email}</div>
      </div>
    </div>

    <div className="space-y-2 mb-4 text-sm">
      <div className="flex justify-between">
        <span className="text-stone-600">Role:</span>
        <span className="font-medium text-stone-900">{user.role}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-stone-600">Status:</span>
        <span
          className={`font-medium ${
            user.status === "Active" ? "text-green-600" : "text-red-600"
          }`}
        >
          {user.status}
        </span>
      </div>
      {user.orders !== undefined && (
        <div className="flex justify-between">
          <span className="text-stone-600">Orders:</span>
          <span className="font-medium text-stone-900">{user.orders}</span>
        </div>
      )}
    </div>

    <div className="flex gap-2 pt-3 border-t border-stone-100">
      <button
        type="button"
        onClick={() => onEdit(user)}
        className="flex-1 p-2 hover:bg-stone-100 rounded-lg text-stone-600 transition-colors flex items-center justify-center gap-2"
      >
        <Edit2 size={16} />
        Edit
      </button>
      <button
        type="button"
        onClick={() => onDelete(user)}
        className="flex-1 p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors flex items-center justify-center gap-2"
      >
        <Trash2 size={16} />
        Delete
      </button>
    </div>
  </div>
);

// ─── Users Page ───────────────────────────────────────────────────────────────

const UsersPage: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, loading } = useUsers();
  const { modal, data, openModal, closeModal } = useModal();

  const [form, setForm] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    role: "Customer",
    status: "Active",
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Reset form
  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      role: "Customer",
      status: "Active",
    });
  };

  // Handle save
  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      alert("Please fill in required fields");
      return;
    }

    try {
      if (modal === "add") {
        await addUser(form);
      } else if (modal === "edit" && data && "id" in data) {
        await updateUser((data as User).id, form);
      }
      closeModal();
      resetForm();
    } catch (error) {
      alert("Error saving user");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.id);
      closeModal();
      setSelectedUser(null);
    } catch (error) {
      alert("Error deleting user");
    }
  };

  // Handle edit
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      status: user.status,
    });
    openModal("edit", user);
  };

  // Handle delete click
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    openModal("delete", user);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-stone-600">Loading users...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Users</h1>
          <p className="text-sm text-stone-600 mt-1">Manage your users and permissions</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            openModal("add");
          }}
        >
          <Plus size={16} />
          Add User
        </Button>
      </div>

      {/* Users Grid */}
      {users.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-stone-600">No users yet. Invite your first user!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        open={modal === "add" || modal === "edit"}
        onClose={closeModal}
        title={modal === "add" ? "Add User" : "Edit User"}
      >
        <UserForm form={form} setForm={setForm} />
        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={closeModal}>Cancel</Button>
          <Button onClick={handleSave}>
            <Save size={15} />
            {modal === "add" ? "Add User" : "Save Changes"}
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDelete
        open={modal === "delete"}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="Remove User"
      >
        <div className="text-5xl mb-2">👤</div>
        <p className="text-stone-600">
          Remove <strong>{selectedUser?.name}</strong>?
        </p>
      </ConfirmDelete>
    </div>
  );
};

export default UsersPage;