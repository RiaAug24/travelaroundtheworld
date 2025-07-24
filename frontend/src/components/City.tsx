import { useParams } from "react-router";
import styles from "./City.module.css";
import { city } from "../../../types/types";
import { useCities } from "../context/CityContext";
import BackButton from "./BackButton";
import { useAuth } from "../context/AuthContext";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  const { cities } = useCities();
  const { id } = useParams();
  const { user } = useAuth();
  // console.log(id);
  const userCities =
    cities && cities.filter((city) => city.userId === user?.id);

  let currentCity = {} as city;
  userCities?.map((city) => {
    console.log(String(city.id) === id);
    if (String(city.id) === id) {
      currentCity = city;
    }
  });

  // console.log(currentCity);
  const { cityName, emoji, date, notes } = currentCity;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>{cityName}</h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <BackButton />
      </div>
    </div>
  );
}

export default City;
