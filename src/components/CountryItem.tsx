import styles from "./CountryItem.module.css";

function CountryItem({ countryName, countryCode }: { countryName: string; countryCode: string }) {
  return (
    <li className={styles.countryItem}>
      <span>{countryCode}</span>
      <span>{countryName}</span>
    </li>
  );
}

export default CountryItem;
