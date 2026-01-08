import { AuthProvider } from "react-admin";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

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

      console.log(data);
      // Check if user is admin
      if (data.userType !== "admin") {
        throw new Error("Access denied. Admin privileges required.");
      }

      localStorage.setItem(
        "auth",
        JSON.stringify({
          token: data.accessToken,
          user: data,
        })
      );

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  logout: () => {
    localStorage.removeItem("auth");
    return Promise.resolve();
  },

  checkAuth: () => {
    const auth = localStorage.getItem("auth");
    return auth ? Promise.resolve() : Promise.reject();
  },

  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("auth");
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

    const { user } = JSON.parse(auth);
    return Promise.resolve(user.userType);
  },
};
