import { Link, NavLink } from "react-router";

import styles from "./PageNav.module.css";
import Logo from "./Logo";
export default function PageNav() {
  return (
    <div className={styles.nav}>
      <div>
        <Link to="/">
          <Logo />
        </Link>
      </div>
      <ul>
        {" "}
        <li>
          <NavLink to="/product">Product</NavLink>
        </li>{" "}
        <li>
          <NavLink to="/pricing">Pricing</NavLink>
        </li>
        <li className={styles.login}>
          <NavLink to="/login">Login</NavLink>
        </li>
      </ul>
    </div>
  );
}
