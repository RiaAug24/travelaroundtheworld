// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useContext, useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router";
import useURLPosition from "../hooks/useURLPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../context/CityContext";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const navigate = useNavigate();
  const { createCity, isLoading } = useCities();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [emoji, setEmoji] = useState("");
  const [date, setDate] = useState<Date | null>(new Date());
  const [notes, setNotes] = useState("");
  const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";
  const [lat, lng] = useURLPosition();
  const [isGeoMapLoading, setIsGeoMapLoading] = useState(false);
  const [geoMapLoadingErr, setGeoMapLoadingErr] = useState<string | null>(null);
  useEffect(() => {
    async function fetchCityData() {
      if (!lat && !lng) return;
      try {
        setIsGeoMapLoading(true);
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();
        if (!data.countryCode)
          throw new Error("Not appears to be a city. Click somewhere else. 😉");

        setGeoMapLoadingErr("");
        setCityName(data.city);
        setCountry(data.countryName);
        setEmoji(data.countryCode);
        console.log(data);
      } catch (error) {
        setGeoMapLoadingErr(
          error instanceof Error ? error.message : "Something went wrong"
        );
        console.log(error);
      } finally {
        setIsGeoMapLoading(false);
      }
    }
    fetchCityData();
  }, [lat, lng]);

  async function handleSubmitFunction(e) {
    e.preventDefault();
    const cityData = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat,
        lng,
      },
      id: Math.floor(Math.random() * Math.pow(10, 8)).toString(),
    };
    await createCity(cityData);
    navigate("/app/cities");
  }

  if (isGeoMapLoading) {
    return <Spinner />;
  }
  if (!lat && !lng) {
    return <Message message="Start adding cities by clicking on the map" />;
  }
  if (geoMapLoadingErr) {
    return <Message message={geoMapLoadingErr} />;
  }

  return (
    <form
      className={`${styles.form}${isLoading ? styles.loading : ""}`}
      onSubmit={(e) => handleSubmitFunction(e)}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">{cityName}</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat={"dd/MM/yyyy"}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type={"primary"}>Add</Button>
        <Button
          type={"back"}
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
