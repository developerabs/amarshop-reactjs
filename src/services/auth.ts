import api from "../services/api";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.error("Login failed:", error);
  }
};
