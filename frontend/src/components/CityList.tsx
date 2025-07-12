import { useCities } from "../context/CityContext";

import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import Message from "./Message";
import Spinner from "./Spinner";
export default function CityList() {
  const {cities, isLoading} = useCities();
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <>
      {cities.length > 0 ? (
        <ul className={styles.cityList}>
          {cities.map((city) => (
            <CityItem key={city.id} city={city} />
          ))}
        </ul>
      ) : (
        <Message
          message={"Add your first city by clicking on any city on the map"}
        />
      )}
    </>
  );
}
