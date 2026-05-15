export function getToken() {
  return localStorage.getItem("token");
}

export function decodeToken(token: string | null) {
  if (!token) return null;

  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    return JSON.parse(atob(base64));
  } catch (err) {
    return null;
  }
}

export function getUserName() {
  const token = getToken();
  const payload = decodeToken(token);
  return payload?.name || "";
}