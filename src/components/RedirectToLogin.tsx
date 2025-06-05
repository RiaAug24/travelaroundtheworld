import { Navigate } from "react-router";
import { useAuth } from "../context/FakeAuthContext";

export default function RedirectToLogin({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
}
