import styles from "./CityItem.module.css";
import { city } from "../types/types";
import { Link } from "react-router";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

export default function CityItem({ city }: { city: city }) {
  return (
    <li>
      <Link
        className={styles.cityItem}
        to={`${city.id}?lat=${city.position?.lat}&lng=${city.position?.lng}`}
      >
        <span className={styles.emoji}>{city.emoji}</span>
        <h3 className={styles.name}>{city.cityName}</h3>
        <p className={styles.notes}>{city.notes}</p>
        <time className={styles.date}>{formatDate(city.date)}</time>
        <button className={styles.deleteBtn}>X</button>
      </Link>
    </li>
  );
}
