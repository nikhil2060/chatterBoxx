import React, { Children } from "react";
import { Outlet, Navigate } from "react-router-dom";

function ProtectRoute({ children, user, redirect = "/login" }) {
  if (!user) <Navigate to={redirect} />;

  return children ? children : <Outlet />;
}

export default ProtectRoute;
