import ky from "ky";
import type { AfterResponseHook } from "ky";

// afterResponse hook: typed to ky's AfterResponseHook to satisfy TS
const onAfterResponse: AfterResponseHook = (async (...args: any[]) => {
  const response = args[2];
  if (response && response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
}) as AfterResponseHook;

const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    afterResponse: [onAfterResponse],
  },
} as any);

export default api;