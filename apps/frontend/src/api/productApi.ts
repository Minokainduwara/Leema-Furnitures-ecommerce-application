import ky from "ky";

const api = ky.create({
  prefixUrl: "http://localhost:8080/api",
  credentials: "include",
});

export const productApi = {
  getAll: () => api.get("products").json(),

  getById: (id: number) =>
    api.get(`products/${id}`).json(),

  create: (formData: FormData) =>
    api.post("products", {
      body: formData,
    }),

  update: (id: number, formData: FormData) =>
    api.put(`products/${id}`, {
      body: formData,
    }),

  delete: (id: number) =>
    api.delete(`products/${id}`),

  search: (keyword: string) =>
    api
      .get(`products/search?keyword=${keyword}`)
      .json(),
};