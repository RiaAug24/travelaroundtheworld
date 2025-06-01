import styles from "./Button.module.css";
import { ButtonType } from "../types/types";
export default function Button({ children, onClick, type }: ButtonType) {
  return (
    <button
      className={`${styles.btn} ${
        // type === "primary" ? styles.primary : styles.back
        styles[type]
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
