import React, { useState } from "react";
import { Plus, Edit2, Trash2, Save } from "lucide-react";
import {
  Btn, Input, Select, Textarea, Modal, ConfirmDelete,
  PageHeader, Toggle,
} from "../../components/ui/admin-ui/index";
import { useServices, useModal } from "../../hooks/Usestore";
import { SERVICE_ICONS, SERVICE_TYPES } from "../../data/Mockdata";
import type { Service, ServiceFormData, ServiceType } from "../../types";

// ─── Type colour map ──────────────────────────────────────────────────────────

const TYPE_COLORS: Record<ServiceType, string> = {
  Warranty:    "bg-blue-50 text-blue-700",
  Delivery:    "bg-amber-50 text-amber-700",
  Protection:  "bg-purple-50 text-purple-700",
  Maintenance: "bg-green-50 text-green-700",
  Support:     "bg-rose-50 text-rose-700",
  "Trade-In":  "bg-teal-50 text-teal-700",
};

// ─── Service Form ─────────────────────────────────────────────────────────────

interface ServiceFormProps {
  form:    ServiceFormData;
  setForm: React.Dispatch<React.SetStateAction<ServiceFormData>>;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ form, setForm }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-stone-600 mb-1.5">Icon</label>
      <div className="flex flex-wrap gap-2">
        {SERVICE_ICONS.map((ic) => (
          <button
            key={ic}
            type="button"
            onClick={() => setForm((f) => ({ ...f, icon: ic }))}
            className={`text-2xl p-2 rounded-lg border-2 transition-all
              ${form.icon === ic ? "border-amber-400 bg-amber-50" : "border-transparent hover:border-stone-200"}`}
          >
            {ic}
          </button>
        ))}
      </div>
    </div>

    <Input
      label="Service Name"
      value={form.name}
      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
      placeholder="e.g. 5-Year Structural Warranty"
    />

    <div className="grid grid-cols-2 gap-3">
      <Select
        label="Type"
        value={form.type}
        onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ServiceType }))}
        options={[...SERVICE_TYPES].map((t) => ({ value: t, label: t }))}
      />
      <Input
        label="Price ($) — 0 for free"
        type="number"
        value={form.price}
        onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
        placeholder="0"
      />
    </div>

    <Textarea
      label="Description"
      value={form.description}
      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
      placeholder="Describe this service…"
    />

    <Toggle
      value={form.active}
      onChange={(v) => setForm((f) => ({ ...f, active: v }))}
      label={`Service is ${form.active ? "active" : "inactive"}`}
    />
  </div>
);

// ─── Service Card ─────────────────────────────────────────────────────────────

interface ServiceCardProps {
  service:  Service;
  onEdit:   (s: Service) => void;
  onDelete: (s: Service) => void;
  onToggle: (id: number) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onEdit, onDelete, onToggle }) => (
  <div className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${service.active ? "border-stone-100" : "border-stone-100 opacity-60"}`}>
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{service.icon}</span>
        <div>
          <div className="font-semibold text-stone-800">{service.name}</div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLORS[service.type]}`}>
            {service.type}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onToggle(service.id)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0
          ${service.active ? "bg-amber-500" : "bg-stone-200"}`}
      >
        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform
          ${service.active ? "translate-x-4" : "translate-x-0.5"}`}
        />
      </button>
    </div>

    <p className="text-sm text-stone-500 mb-4 leading-relaxed">{service.description}</p>

    <div className="flex items-center justify-between">
      <div>
        <span className="text-lg font-bold text-stone-800">
          {service.price === 0 ? "Free" : `$${service.price}`}
        </span>
        <span className="text-xs text-stone-400 ml-1">{service.subscribers} subscribers</span>
      </div>
      <div className="flex gap-1.5">
        <button onClick={() => onEdit(service)}   className="p-1.5 rounded-lg hover:bg-amber-50 text-stone-400 hover:text-amber-600 transition-colors"><Edit2  size={14} /></button>
        <button onClick={() => onDelete(service)} className="p-1.5 rounded-lg hover:bg-red-50   text-stone-400 hover:text-red-500   transition-colors"><Trash2 size={14} /></button>
      </div>
    </div>
  </div>
);

// ─── Services Page ────────────────────────────────────────────────────────────

const EMPTY_FORM: ServiceFormData = {
  name: "", type: "Warranty", price: 0, description: "", icon: "🛡️", active: true,
};

const ServicesPage: React.FC = () => {
  const { services, addService, updateService, deleteService, toggleService } = useServices();
  const { modal, selected, open, close }                                      = useModal<Service>();
  const [form, setForm]                                                       = useState<ServiceFormData>(EMPTY_FORM);

  const handleOpenAdd  = (): void => { setForm(EMPTY_FORM); open("add"); };
  const handleOpenEdit = (s: Service): void => { setForm({ ...s }); open("edit", s); };
  const handleOpenDel  = (s: Service): void => open("delete", s);

  const handleSave = (): void => {
    if (modal === "add") addService(form);
    else if (selected) updateService(selected.id, form);
    close();
  };
  const handleDelete = (): void => {
    if (selected) deleteService(selected.id);
    close();
  };

  const totalRevenue = services.reduce((a, s) => a + s.price * s.subscribers, 0);
  const totalSubs    = services.reduce((a, s) => a + s.subscribers, 0);

  const summaryItems = [
    { label: "Active Services",       value: services.filter((s) => s.active).length, color: "text-emerald-600" },
    { label: "Total Subscribers",     value: totalSubs.toLocaleString(),               color: "text-amber-600" },
    { label: "Revenue from Services", value: `$${totalRevenue.toLocaleString()}`,      color: "text-stone-800" },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Services"
        subtitle="Manage warranties, delivery, and support plans"
        action={<Btn onClick={handleOpenAdd}><Plus size={16} />Add Service</Btn>}
      />

      <div className="grid grid-cols-3 gap-4">
        {summaryItems.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-stone-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {services.map((s) => (
          <ServiceCard
            key={s.id}
            service={s}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDel}
            onToggle={toggleService}
          />
        ))}
      </div>

      <Modal open={modal === "add" || modal === "edit"} onClose={close} title={modal === "add" ? "Add Service" : "Edit Service"}>
        <ServiceForm form={form} setForm={setForm} />
        <div className="flex justify-end gap-2 mt-6">
          <Btn variant="secondary" onClick={close}>Cancel</Btn>
          <Btn onClick={handleSave}><Save size={15} />{modal === "add" ? "Add Service" : "Save Changes"}</Btn>
        </div>
      </Modal>

      <ConfirmDelete open={modal === "delete"} onClose={close} onConfirm={handleDelete} title="Remove Service">
        <div className="text-5xl mb-2">{selected?.icon}</div>
        <p className="text-stone-600">Remove <strong>{selected?.name}</strong>?</p>
      </ConfirmDelete>
    </div>
  );
};

export default ServicesPage;