import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import Message from "./Message";
import Spinner from "./Spinner";
import { useCities } from "../context/CityContext";
export default function CountryList() {
  const { cities, isLoading } = useCities();
  if (isLoading) {
    return <Spinner />;
  }

  type countriesType = { countryName: string; countryCode: string }[];
  const countries: countriesType = cities.reduce((acc, city) => {
    const country = acc.find((c) => c.countryName === city.country);
    if (!country) {
      acc.push({ countryName: city.country, countryCode: city.emoji });
    }
    return acc;
  }, [] as countriesType);

  // console.log(countries);
  // countries.map((country => {
  //   console.log(country);
  // }));
  return (
    <>
      {cities.length > 0 ? (
        <ul className={styles.countryList}>
          {countries.map((country) => (
            <CountryItem
              key={country.countryCode}
              countryName={country.countryName}
              countryCode={country.countryCode}
            />
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
