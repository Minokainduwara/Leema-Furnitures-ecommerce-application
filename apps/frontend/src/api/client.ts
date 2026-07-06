import ky from "ky";

const API_ROOT = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(
  /\/api$/,
  ""
);

const api = ky.create({
  prefixUrl: `${API_ROOT}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    beforeRequest: [
      (request) => {
        // Read both keys — the legacy admin/seller flow stores under "token",
        // the new uiparts pages store under "accessToken".
        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("accessToken");
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        }
      },
    ],
  },
  // Add credentials mode for CORS with cookies/auth
  credentials: "include",
});

export default api;