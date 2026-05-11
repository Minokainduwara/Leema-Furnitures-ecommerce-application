import ky from "ky";

const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL || "http://localhost:8080/api",

  // ❌ REMOVE THIS (important for JWT auth)
  // credentials: "include",

  headers: {
    "Content-Type": "application/json",
  },

  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem("token");

        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],

    afterResponse: [
      async (_request, _options, response) => {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          // safer redirect
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }

        return response;
      },
    ],
  },
});

export default api;