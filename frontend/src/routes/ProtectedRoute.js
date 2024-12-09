import { Navigate } from "react-router-dom";
import { isLoggedIn, getToken } from "../services/authService";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  try {
    if (!isLoggedIn()) {
      return <Navigate to="/login" replace />;
    }

    const token = getToken();
    const decoded = JSON.parse(atob(token.split(".")[1]));
    const userRole = decoded.role;

    if (allowedRoles.length && !allowedRoles.includes(userRole)) {
      alert("Bạn không có quyền truy cập vào trang này.");
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (err) {
    return <Navigate to="/logout" replace />;
  }
};

export default ProtectedRoute;