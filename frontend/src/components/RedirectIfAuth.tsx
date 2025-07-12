import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
export default function RedirectIfAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate replace to="/app"/>;
  return <>{children}</>;
}
