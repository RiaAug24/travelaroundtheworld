import styles from "./CityItem.module.css";
import { city } from "../../../types/types";
import { Link } from "react-router";
import { useCities } from "../context/CityContext";

function formatDate(dateString: string | null | undefined) {
  if (!dateString) return 'No date';

  try {
    const timestamp = Number(dateString);
    const date = isNaN(timestamp) ? new Date(dateString) : new Date(timestamp);

    if (isNaN(date.getTime())) return 'Invalid date';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
}
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
