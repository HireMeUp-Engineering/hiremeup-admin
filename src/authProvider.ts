import { AuthProvider } from "react-admin";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
  throw new Error("REACT_APP_API_URL environment variable is required");
}

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes of inactivity
const ACTIVITY_KEY = "lastActivity";

function updateActivity() {
  localStorage.setItem(ACTIVITY_KEY, Date.now().toString());
}

function isSessionExpired(): boolean {
  const lastActivity = localStorage.getItem(ACTIVITY_KEY);
  if (!lastActivity) return true;
  return Date.now() - parseInt(lastActivity, 10) > SESSION_TIMEOUT_MS;
}

function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return false;
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function clearAuth() {
  localStorage.removeItem("auth");
  localStorage.removeItem(ACTIVITY_KEY);
}

// Track user activity for session timeout
if (typeof window !== "undefined") {
  const activityEvents = ["mousedown", "keydown", "scroll", "touchstart"];
  activityEvents.forEach((event) => {
    window.addEventListener(event, updateActivity, { passive: true });
  });
}

export const authProvider: AuthProvider = {
  login: async ({ username, password, email }) => {
    const request = new Request(`${API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email: email || username, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    try {
      const response = await fetch(request);
      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.statusText);
      }

      const data = await response.json();

      // Check if user is admin
      if (
        !data.userRoles.some(
          (role: { roleType: string }) => role.roleType === "admin"
        )
      ) {
        throw new Error("Access denied. Admin privileges required.");
      }

      // Store only minimal required data
      localStorage.setItem(
        "auth",
        JSON.stringify({
          token: data.accessToken,
          user: {
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            profileImage: data.profileImage,
            userRoles: data.userRoles,
          },
        })
      );
      updateActivity();

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  logout: () => {
    clearAuth();
    return Promise.resolve();
  },

  checkAuth: () => {
    const auth = localStorage.getItem("auth");
    if (!auth) return Promise.reject();

    try {
      const { token } = JSON.parse(auth);

      if (isTokenExpired(token)) {
        clearAuth();
        return Promise.reject({
          message: "Session expired. Please login again.",
        });
      }

      if (isSessionExpired()) {
        clearAuth();
        return Promise.reject({
          message: "Session timed out due to inactivity.",
        });
      }

      updateActivity();
      return Promise.resolve();
    } catch {
      clearAuth();
      return Promise.reject();
    }
  },

  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      clearAuth();
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getIdentity: () => {
    try {
      const auth = localStorage.getItem("auth");
      if (!auth) {
        return Promise.reject();
      }

      const { user } = JSON.parse(auth);
      return Promise.resolve({
        id: user.id,
        fullName: `${user.firstName} ${user.lastName}`,
        avatar: user.profileImage,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  },

  getPermissions: () => {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      return Promise.reject();
    }

    try {
      const { token } = JSON.parse(auth);
      if (isTokenExpired(token)) {
        clearAuth();
        return Promise.reject();
      }

      const { user } = JSON.parse(auth);
      const adminRole = user.userRoles?.find(
        (role: { roleType: string }) => role.roleType === "admin"
      );
      return Promise.resolve(adminRole ? "admin" : "user");
    } catch {
      return Promise.reject();
    }
  },
};
