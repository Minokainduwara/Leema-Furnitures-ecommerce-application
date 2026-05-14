import ky from "ky";

const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  credentials: "include",
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
});

export default api;
