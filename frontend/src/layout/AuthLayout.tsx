import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

const AuthLayout = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log("User: ", user)
  }, [user])

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return user ? <Navigate to="/home" /> : <Outlet />;
};

export default AuthLayout;