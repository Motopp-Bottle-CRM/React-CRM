import React from "react";
import { Navigate } from "react-router-dom";
import { hasAccess } from "../utils/permissions"; 

interface ProtectedRouteProps {
  role: string;
  module: string;
  children: JSX.Element;
}

const ProtectedRoute = ({ role, module, children }: ProtectedRouteProps) => {
  const access = hasAccess(role, module);
  return access ? children : <Navigate to="/not-found" replace />;
};

export default ProtectedRoute;