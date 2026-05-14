import React from "react";
import { X, Search, ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { BadgeVariant, BtnVariant, BtnSize, ModalSize, AvatarSize, StatCardProps } from "../../../types";

// ─── Badge ────────────────────────────────────────────────────────────────────

interface BadgeProps {
  children:  React.ReactNode;
  variant?:  BadgeVariant;
  className?: string;
}

const BADGE_VARIANTS: Record<BadgeVariant, string> = {
  default: "bg-stone-100 text-stone-600",
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border border-amber-200",
  danger:  "bg-red-50 text-red-600 border border-red-200",
  info:    "bg-blue-50 text-blue-700 border border-blue-200",
  purple:  "bg-purple-50 text-purple-700 border border-purple-200",
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = "default", className = "" }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${BADGE_VARIANTS[variant]} ${className}`}>
    {children}
  </span>
);

// ─── Button ───────────────────────────────────────────────────────────────────

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  BtnVariant;
  size?:     BtnSize;
}

const BTN_SIZES: Record<BtnSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

const BTN_VARIANTS: Record<BtnVariant, string> = {
  primary:   "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-200",
  secondary: "bg-stone-100 hover:bg-stone-200 text-stone-700",
  danger:    "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200",
  ghost:     "hover:bg-stone-100 text-stone-600",
  dark:      "bg-stone-800 hover:bg-stone-900 text-white",
};

export const Btn: React.FC<BtnProps> = ({
  children, variant = "primary", size = "md", className = "", ...props
}) => (
  <button
    className={`inline-flex items-center gap-2 font-medium rounded-xl transition-all
      disabled:opacity-50 disabled:cursor-not-allowed
      ${BTN_SIZES[size]} ${BTN_VARIANTS[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = "", ...props }) => (
  <div>
    {label && <label className="block text-sm font-medium text-stone-600 mb-1.5">{label}</label>}
    <input
      className={`w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm
        focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all
        placeholder:text-stone-400 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  </div>
);

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?:   string;
  options?: SelectOption[];
}

export const Select: React.FC<SelectProps> = ({ label, options = [], ...props }) => (
  <div>
    {label && <label className="block text-sm font-medium text-stone-600 mb-1.5">{label}</label>}
    <select
      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm
        focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
      {...props}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

// ─── Textarea ─────────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, ...props }) => (
  <div>
    {label && <label className="block text-sm font-medium text-stone-600 mb-1.5">{label}</label>}
    <textarea
      rows={3}
      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm
        focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all
        placeholder:text-stone-400 resize-none"
      {...props}
    />
  </div>
);

// ─── Toggle ───────────────────────────────────────────────────────────────────

interface ToggleProps {
  value:     boolean;
  onChange:  (val: boolean) => void;
  label?:    string;
}

export const Toggle: React.FC<ToggleProps> = ({ value, onChange, label }) => (
  <div className="flex items-center gap-3">
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        ${value ? "bg-amber-500" : "bg-stone-200"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform
          ${value ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
    {label && <span className="text-sm text-stone-600">{label}</span>}
  </div>
);

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  open:     boolean;
  onClose:  () => void;
  title:    string;
  children: React.ReactNode;
  size?:    ModalSize;
}

const MODAL_SIZES: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, size = "md" }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${MODAL_SIZES[size]} bg-white rounded-2xl shadow-2xl overflow-hidden`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h3 className="text-lg font-semibold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>
  );
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

interface AvatarProps {
  initials:   string;
  size?:      AvatarSize;
  className?: string;
}

const AVATAR_SIZES: Record<AvatarSize, string> = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-20 h-20 text-2xl",
};

export const Avatar: React.FC<AvatarProps> = ({ initials, size = "md", className = "" }) => (
  <div
    className={`rounded-xl bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center
      text-white font-bold shadow-md ${AVATAR_SIZES[size]} ${className}`}
  >
    {initials}
  </div>
);

// ─── ConfirmDelete ────────────────────────────────────────────────────────────

interface ConfirmDeleteProps {
  open:      boolean;
  onClose:   () => void;
  onConfirm: () => void;
  title:     string;
  children:  React.ReactNode;
}

export const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({
  open, onClose, onConfirm, title, children,
}) => (
  <Modal open={open} onClose={onClose} title={title} size="sm">
    <div className="text-center space-y-3">
      {children}
      <div className="flex gap-2 justify-center mt-4">
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn variant="danger"    onClick={onConfirm}>Delete</Btn>
      </div>
    </div>
  </Modal>
);

// ─── PageHeader ───────────────────────────────────────────────────────────────

interface PageHeaderProps {
  title:     string;
  subtitle?: string;
  action?:   React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div>
      <h1 className="text-2xl font-bold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>
        {title}
      </h1>
      {subtitle && <p className="text-sm text-stone-500 mt-0.5">{subtitle}</p>}
    </div>
    {action}
  </div>
);

// ─── StatCard ─────────────────────────────────────────────────────────────────

export const StatCard: React.FC<StatCardProps> = ({
  label, value, change, up, icon: Icon,
  colorClass, bgClass, ringClass,
}) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-2.5 rounded-xl ${bgClass} ring-4 ${ringClass}`}>
        <Icon size={18} className={colorClass} />
      </div>
      {change !== undefined && (
        <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? "text-emerald-600" : "text-red-500"}`}>
          {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {change}
        </span>
      )}
    </div>
    <div className="text-2xl font-bold text-stone-800">{value}</div>
    <div className="text-xs text-stone-500 mt-0.5">{label}</div>
  </div>
);

// ─── SearchBar ────────────────────────────────────────────────────────────────

interface SearchBarProps {
  value:        string;
  onChange:     (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?:   string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value, onChange, placeholder = "Search...", className = "",
}) => (
  <div className={`relative ${className}`}>
    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 bg-stone-50 text-sm
        focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
    />
  </div>
);