import { useAuth } from "../context/AuthContext";
import { useCities } from "../context/CityContext";

import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import Message from "./Message";
import Spinner from "./Spinner";
export default function CityList() {
  const { user } = useAuth();
  const { cities, isLoading } = useCities();
  const userCities = cities && cities.filter((city) => city.userId === user?.id);
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <>
      {userCities.length > 0 ? (
        <ul className={styles.cityList}>
          {userCities?.map((city) => (
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
