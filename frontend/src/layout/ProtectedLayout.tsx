import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedLayout = () => {
    const { user, loading } = useAuth();
  
    if (loading) {
      return <h1>Loading...</h1>;
    }
  
    return user ? <Outlet /> : <Navigate to="/login" />;
  };
  
  export default ProtectedLayout;
  