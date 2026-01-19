const API_URL = import.meta.env.VITE_BACKEND_URL;

// -------- REGISTER --------
export async function registerUser(email, password, name) {
  console.log("REGISTER API:", `${API_URL}/api/auth/register`); // 👈 ADD THIS LINE

  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      email,
      password
    })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}

// -------- LOGIN --------
export async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  localStorage.setItem("token", data.access_token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
}

// -------- AUTH CHECK --------
export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

// -------- LOGOUT --------
export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}