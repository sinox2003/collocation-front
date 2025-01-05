import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";


const NoAuthenticatedGuard = ({ children }) => {
  const token = Cookies.get("jwtToken");


  // If the user is not authenticated, redirect to the login page
  return !token ? <>{children}</> : <Navigate to="/" replace />;
};

export default NoAuthenticatedGuard;