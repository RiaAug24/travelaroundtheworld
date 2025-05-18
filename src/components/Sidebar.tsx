import { Outlet } from "react-router";
import AppNav from "./AppNav";
import Footer from "./Footer";
import Logo from "./Logo";
import style from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <div className={style.sidebar}>
      <Logo />
      <AppNav />
      <Outlet />
      <Footer />
    </div>
  );
}
