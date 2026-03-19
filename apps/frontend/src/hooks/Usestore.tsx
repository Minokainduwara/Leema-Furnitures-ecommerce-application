import { useState } from "react";
import type {
  Product, ProductFormData,
  User, UserFormData,
  Service, ServiceFormData,
  ModalType, UseModalReturn,
} from "../types";
import { INITIAL_PRODUCTS, INITIAL_USERS, INITIAL_SERVICES } from "../data/Mockdata";

// ─── useProducts ──────────────────────────────────────────────────────────────

interface UseProductsReturn {
  products:      Product[];
  addProduct:    (data: ProductFormData) => void;
  updateProduct: (id: number, data: ProductFormData) => void;
  deleteProduct: (id: number) => void;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  const addProduct = (data: ProductFormData): void => {
    setProducts((prev) => [
      ...prev,
      {
        ...data,
        id:     Date.now(),
        price:  Number(data.price),
        stock:  Number(data.stock),
        rating: 4.5,
        sales:  0,
      },
    ]);
  };

  const updateProduct = (id: number, data: ProductFormData): void => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...data, price: Number(data.price), stock: Number(data.stock) }
          : p
      )
    );
  };

  const deleteProduct = (id: number): void => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return { products, addProduct, updateProduct, deleteProduct };
}

// ─── useUsers ─────────────────────────────────────────────────────────────────

interface UseUsersReturn {
  users:      User[];
  addUser:    (data: UserFormData) => void;
  updateUser: (id: number, data: UserFormData) => void;
  deleteUser: (id: number) => void;
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);

  const addUser = (data: UserFormData): void => {
    setUsers((prev) => [
      ...prev,
      {
        ...data,
        id:     Date.now(),
        orders: 0,
        spent:  0,
        joined: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        avatar: data.name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
      },
    ]);
  };

  const updateUser = (id: number, data: UserFormData): void => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
  };

  const deleteUser = (id: number): void => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return { users, addUser, updateUser, deleteUser };
}

// ─── useServices ──────────────────────────────────────────────────────────────

interface UseServicesReturn {
  services:       Service[];
  addService:     (data: ServiceFormData) => void;
  updateService:  (id: number, data: ServiceFormData) => void;
  deleteService:  (id: number) => void;
  toggleService:  (id: number) => void;
}

export function useServices(): UseServicesReturn {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);

  const addService = (data: ServiceFormData): void => {
    setServices((prev) => [
      ...prev,
      { ...data, id: Date.now(), price: Number(data.price), subscribers: 0 },
    ]);
  };

  const updateService = (id: number, data: ServiceFormData): void => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, ...data, price: Number(data.price) } : s
      )
    );
  };

  const deleteService = (id: number): void => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleService = (id: number): void => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  return { services, addService, updateService, deleteService, toggleService };
}

// ─── useModal ─────────────────────────────────────────────────────────────────

export function useModal<T>(): UseModalReturn<T> {
  const [modal,    setModal]    = useState<ModalType>(null);
  const [selected, setSelected] = useState<T | null>(null);

  const open = (type: NonNullable<ModalType>, item?: T): void => {
    setSelected(item ?? null);
    setModal(type);
  };

  const close = (): void => {
    setModal(null);
    setSelected(null);
  };

  return { modal, selected, open, close };
}