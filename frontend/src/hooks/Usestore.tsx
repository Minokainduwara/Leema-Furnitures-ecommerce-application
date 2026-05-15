import { useState, useEffect } from "react";
import type {
  Product, ProductFormData,
  User, UserFormData,
  Service, ServiceFormData,
  ModalType,
} from "../types";
import api from "../api/client";

// ─── useProducts ──────────────────────────────────────────────────────────────

interface UseProductsReturn {
  products:      Product[];
  addProduct:    (data: ProductFormData) => Promise<void>;
  updateProduct: (id: number, data: ProductFormData) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  loading:       boolean;
  error:         string | null;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.get("products").json<Product[]>();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (data: ProductFormData): Promise<void> => {
    try {
      const payload = {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
      };
      const newProduct = await api.post("products", { json: payload }).json<Product>();
      setProducts((prev) => [...prev, newProduct]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add product");
      throw err;
    }
  };

  const updateProduct = async (id: number, data: ProductFormData): Promise<void> => {
    try {
      const payload = {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
      };
      const updated = await api.put(`products/${id}`, { json: payload }).json<Product>();
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
      throw err;
    }
  };

  const deleteProduct = async (id: number): Promise<void> => {
    try {
      await api.delete(`products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
      throw err;
    }
  };

  return { products, addProduct, updateProduct, deleteProduct, loading, error };
}

// ─── useServices ──────────────────────────────────────────────────────────────

interface UseServicesReturn {
  services:      Service[];
  addService:    (data: ServiceFormData) => Promise<void>;
  updateService: (id: number, data: ServiceFormData) => Promise<void>;
  deleteService: (id: number) => Promise<void>;
  loading:       boolean;
  error:         string | null;
}

export function useServices(): UseServicesReturn {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await api.get("services").json<Service[]>();
      setServices(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  const addService = async (data: ServiceFormData): Promise<void> => {
    try {
      const payload = {
        ...data,
        price: Number(data.price),
      };
      const newService = await api.post("services", { json: payload }).json<Service>();
      setServices((prev) => [...prev, newService]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add service");
      throw err;
    }
  };

  const updateService = async (id: number, data: ServiceFormData): Promise<void> => {
    try {
      const payload = {
        ...data,
        price: Number(data.price),
      };
      const updated = await api.put(`services/${id}`, { json: payload }).json<Service>();
      setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update service");
      throw err;
    }
  };

  const deleteService = async (id: number): Promise<void> => {
    try {
      await api.delete(`services/${id}`);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete service");
      throw err;
    }
  };




  return { services, addService, updateService, deleteService, loading, error };
}

// ─── useUsers ──────────────────────────────────────────────────────────────

interface UseUsersReturn {
  users:      User[];
  addUser:    (data: UserFormData) => Promise<void>;
  updateUser: (id: number, data: UserFormData) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  loading:    boolean;
  error:      string | null;
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.get("users").json<User[]>();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (data: UserFormData): Promise<void> => {
    try {
      const newUser = await api.post("users", { json: data }).json<User>();
      setUsers((prev) => [...prev, newUser]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add user");
      throw err;
    }
  };

  const updateUser = async (id: number, data: UserFormData): Promise<void> => {
    try {
      const updated = await api.put(`users/${id}`, { json: data }).json<User>();
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
      throw err;
    }
  };

  const deleteUser = async (id: number): Promise<void> => {
    try {
      await api.delete(`users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
      throw err;
    }
  };

  return { users, addUser, updateUser, deleteUser, loading, error };
}

// ─── useModal ──────────────────────────────────────────────────────────────

interface UseModalReturn {
  modal: ModalType | null;
  data: any;
  openModal: (type: ModalType, payload?: any) => void;
  closeModal: () => void;
}

export function useModal(): UseModalReturn {
  const [modal, setModal] = useState<ModalType | null>(null);
  const [data, setData] = useState<any>(null);

  const openModal = (type: ModalType, payload?: any): void => {
    setModal(type);
    setData(payload ?? null);
  };

  const closeModal = (): void => {
    setModal(null);
    setData(null);
  };

  return { modal, data, openModal, closeModal };
}