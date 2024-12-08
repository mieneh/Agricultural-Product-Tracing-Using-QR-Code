import { getToken, isLoggedIn } from "../services/authService";

export const useAuth = () => {
  if (!isLoggedIn()) return { user: null, isAuthenticated: false };

  try {
    const token = getToken();
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return { user: decoded, isAuthenticated: true };
  } catch (error) {
    console.error("Decode token error:", error);
    return { user: null, isAuthenticated: false };
  }
};
