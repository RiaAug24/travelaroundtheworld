import { Link } from "react-router";
import Logo from "../components/Logo";
import styles from "./PageNotFound.module.css";
export default function PageNotFound() {
  return (
    <>
      <div className={styles.pageNotFound}>
        <Link to="/">
          <Logo />
        </Link>
        <div style={{ textAlign: "center", margin: "15% 0" }}>
          <h1>Page not found 😢</h1>
        </div>
      </div>
    </>
  );
}
