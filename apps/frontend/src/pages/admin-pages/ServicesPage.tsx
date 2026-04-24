import { useState } from "react";
import { Plus, Edit2, Trash2, Save } from "lucide-react";
import type { Service, ServiceFormData } from "../../types";
import { useServices } from "../../hooks/Usestore";
import { useModal } from "../../hooks/Usestore";
import { Input, Select, Textarea } from "../../components/ui/admin-ui";
import Button from "../../components/ui/admin-ui/Button";
import Modal from "../../components/ui/Modals";
import ConfirmDelete from "../../components/ui/ConfirmDelete";

// ─── Service Type Colors ───────────────────────────────────────────────────────

const TYPE_COLORS: Record<string, string> = {
  Warranty: "bg-blue-100 text-blue-700",
  Support: "bg-green-100 text-green-700",
  Installation: "bg-purple-100 text-purple-700",
  Consultation: "bg-orange-100 text-orange-700",
  Maintenance: "bg-red-100 text-red-700",
};

const SERVICE_TYPES = ["Warranty", "Support", "Installation", "Consultation", "Maintenance"];

// ─── Service Form Component ────────────────────────────────────────────────────

interface ServiceFormProps {
  form: ServiceFormData;
  setForm: (form: ServiceFormData) => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ form, setForm }) => {
  const iconEmojis = ["🛡️", "🔧", "💼", "📞", "✅", "⚙️", "🚀", "💡"];

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-stone-600 block mb-2">Icon</label>
        <div className="flex gap-2 flex-wrap">
          {iconEmojis.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => setForm({ ...form, icon })}
              className={`text-2xl p-2 rounded-lg border-2 transition-all ${
                form.icon === icon
                  ? "border-amber-500 bg-amber-50"
                  : "border-stone-200 hover:border-stone-300"
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Service Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="e.g. 5-Year Structural Warranty"
      />

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Type"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value as any })}
          options={SERVICE_TYPES.map((t) => ({ value: t, label: t }))}
        />
        <Input
          label="Price ($)"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          placeholder="0"
        />
      </div>

      <Textarea
        label="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Service description..."
      />
    </div>
  );
};

// ─── Service Card Component ────────────────────────────────────────────────────

interface ServiceCardProps {
  service: Service;
  onEdit: (s: Service) => void;
  onDelete: (s: Service) => void;
  onToggle: (id: number) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onEdit, onDelete, onToggle }) => (
  <div
    className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${
      service.active ? "border-stone-100" : "border-stone-100 opacity-60"
    }`}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{service.icon}</span>
        <div>
          <div className="font-semibold text-stone-800">{service.name}</div>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              TYPE_COLORS[service.type] || "bg-stone-100 text-stone-700"
            }`}
          >
            {service.type}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onToggle(service.id)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${
          service.active ? "bg-amber-500" : "bg-stone-200"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${
            service.active ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>

    <p className="text-sm text-stone-600 mb-4 line-clamp-2">{service.description}</p>

    <div className="flex items-center justify-between pt-3 border-t border-stone-100">
      <div className="font-semibold text-stone-900">${service.price}</div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onEdit(service)}
          className="p-2 hover:bg-stone-100 rounded-lg text-stone-600 transition-colors"
        >
          <Edit2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(service)}
          className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  </div>
);

// ─── Services Page ────────────────────────────────────────────────────────────

const ServicesPage: React.FC = () => {
  const { services, addService, updateService, deleteService, loading } =
    useServices();
  const { modal, openModal, closeModal } = useModal();

  const [form, setForm] = useState<ServiceFormData>({
    name: "",
    type: "Warranty",
    price: 0,
    description: "",
    icon: "🛡️",
    active: true,
  });

  const [selected, setSelected] = useState<Service | null>(null);

  // Reset form
  const resetForm = () => {
    setForm({
      name: "",
      type: "Warranty",
      price: 0,
      description: "",
      icon: "🛡️",
      active: true,
    });
  };

  // Handle save
  const handleSave = async () => {
    if (!form.name.trim()) {
      alert("Please enter service name");
      return;
    }

    try {
      if (modal === "add") {
        await addService(form);
      } else if (modal === "edit" && selected) {
        await updateService(selected.id, form);
      }
      closeModal();
      resetForm();
    } catch (error) {
      alert("Error saving service");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selected) return;
    try {
      await deleteService(selected.id);
      closeModal();
      setSelected(null);
    } catch (error) {
      alert("Error deleting service");
    }
  };

  // Handle edit
  const handleEdit = (service: Service) => {
    setSelected(service);
    setForm({
      name: service.name,
      type: service.type,
      price: service.price,
      description: service.description || "",
      icon: service.icon,
      active: service.active,
    });
    openModal("edit");
  };

  // Handle delete click
  const handleDeleteClick = (service: Service) => {
    setSelected(service);
    openModal("delete");
  };

  // Handle toggle
  const handleToggle = async (id: number) => {
    try {
      const service = services.find((s) => s.id === id);
      if (service) {
        await updateService(id, {
          active: !service.active,
          name: "",
          icon: "",
          type: "Warranty",
          price: 0,
          description: ""
        });
      }
    } catch (error) {
      alert("Error toggling service");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-stone-600">Loading services...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Services</h1>
          <p className="text-sm text-stone-600 mt-1">Manage your service offerings</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            openModal("add");
          }}
        >
          <Plus size={16} />
          Add Service
        </Button>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-stone-600">No services yet. Create your first service!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        open={modal === "add" || modal === "edit"}
        onClose={closeModal}
        title={modal === "add" ? "Add Service" : "Edit Service"}
      >
        <ServiceForm form={form} setForm={setForm} />
        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save size={15} />
            {modal === "add" ? "Add Service" : "Save Changes"}
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDelete
        open={modal === "delete"}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="Remove Service"
      >
        <div className="text-5xl mb-2">{selected?.icon}</div>
        <p className="text-stone-600">
          Remove <strong>{selected?.name}</strong>?
        </p>
      </ConfirmDelete>
    </div>
  );
};

export default ServicesPage;