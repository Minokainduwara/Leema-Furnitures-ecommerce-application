import ky from "ky";

const api = ky.create({
  prefixUrl: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
  },
});

export default api;