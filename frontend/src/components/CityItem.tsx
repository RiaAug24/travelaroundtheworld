import styles from "./CityItem.module.css";
import { city } from "../types/types";
import { Link } from "react-router";
import { useCities } from "../context/CityContext";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

export default function CityItem({ city }: { city: city }) {
  const { currentCity, deleteCity } = useCities();
  return (
    <li>
      <Link
        className={`${styles.cityItem} ${currentCity.id === city.id ? styles.active : ""}`}
        to={`${city.id}?lat=${city?.latitude}&lng=${city?.longitude}`}
      >
        <span className={styles.emoji}>{city.emoji}</span>
        <h3 className={styles.name}>{city.cityName}</h3>
        <p className={styles.notes}>{city.notes}</p>
        <time className={styles.date}>{formatDate(city.date)}</time>
        <button
          className={styles.deleteBtn}
          onClick={(e) => {
            e.preventDefault();
            deleteCity(city.id);
          }}
        >
          X
        </button>
      </Link>
    </li>
  );
}
