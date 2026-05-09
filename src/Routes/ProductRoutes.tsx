import React, { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../State/Store";

interface Props {
  children: JSX.Element;
  allowedRole?: string;
}

const ProtectedRoute: React.FC<Props> = ({ children, allowedRole }) => {
  const { jwt, role } = useAppSelector((state) => state.auth);

  // Not logged in
  if (!jwt) {
    return <Navigate to="/login" replace />;
  }

  // Role check (optional)
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
