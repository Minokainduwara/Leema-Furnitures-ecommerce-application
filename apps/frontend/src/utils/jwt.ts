export function getToken() {
  return localStorage.getItem("token");
}

export function decodeToken(token: string | null) {
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (err) {
    return null;
  }
}

export function getUserName() {
  const token = getToken();
  const payload = decodeToken(token);
  return payload?.name || "";
}