import ky from "ky";

// Use `prefix`/`baseUrl` so the client works with ky v2 (prefixUrl renamed in v2)
const baseUrl = (import.meta.env.VITE_API_URL || "http://localhost:8080/api").replace(/\/+$/, "");

const api = ky.create({
  prefix: baseUrl,
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },

  hooks: {
    beforeRequest: [
      (kyState: any, optionsArg: any) => {
        // In ky v2+, the first argument is an object { request, options, retryCount }.
        // In older ky, the first argument is the Request object.
        const actualRequest = kyState.request || kyState;
        
        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("accessToken");

        try {
          // eslint-disable-next-line no-console
          console.debug("api.beforeRequest", { url: actualRequest?.url || actualRequest, tokenPresent: Boolean(token) });
        } catch (e) {}

        if (token && actualRequest && actualRequest.headers) {
          try {
            if (typeof actualRequest.headers.set === "function") {
              actualRequest.headers.set("Authorization", `Bearer ${token}`);
            } else {
              actualRequest.headers["Authorization"] = `Bearer ${token}`;
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn("api.beforeRequest: unexpected error while setting headers", e);
          }
        }
      },
    ],
    afterResponse: [
      async (state: any) => {
        const response = state.response || state;
        if (response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        }
      },
    ],
  },
});

export default api;
