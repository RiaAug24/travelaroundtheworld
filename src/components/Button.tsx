import styles from "./Button.module.css";

export default function Button({ children, onClick, type }) {
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
