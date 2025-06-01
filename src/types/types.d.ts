import emojiFlags from "emoji-flags";
import City from "../components/City";
import { FormEventHandler, ReactNode } from "react";

export type city = {
  cityName: string;
  country: string;
  emoji: emojiFlags;
  date: Date | null;
  notes: string;
  position: {
    lat: number;
    lng: number;
  };
  id: string;
};

export type CityContexType = {
  cities: City[];
  isLoading: boolean;
  createCity: (city: city) => Promise<void>,
  deleteCity: (id: string) => Promise<void>
};

export type ButtonType = {
  children: ReactNode;
  onClick?: FormEventHandler;
  type: string;
};
