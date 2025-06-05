import style from "./AppLayout.module.css";
import Sidebar from "../components/Sidebar";
import Map from "../components/Map";
import User from "../components/User";
import { useAuth } from "../context/FakeAuthContext";
export default function AppLayout() {
  const { isAuthenticated } = useAuth();
  return (
    <main className={style.app}>
      <Sidebar />
      <Map />
      {isAuthenticated ? <User /> : ""}
    </main>
  );
}
