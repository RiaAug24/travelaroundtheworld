import emojiFlags from "emoji-flags";
import City from "../frontend/src/components/City";
import { ReactNode } from "react";

export type city = {
  id?: string;
  cityName: string;
  country: string;
  emoji: emojiFlags;
  date: Date | null;
  notes: string;
  latitude: number;
  longitude: number;
};

export type CityContexType = {
  cities?: City[];
  isLoading: boolean;
  currentCity: city;
  createCity: (city: city) => Promise<void>;
  deleteCity: (id: string | undefined) => Promise<void>;
};

export type ButtonType = {
  children: ReactNode;
  onClick?: FormEventHandler;
  type: string;
};

export type userType = {
  username: string;
  email: string;
  password: string | number;
  avatar: string;
};


export type AuthStateType = {
  user: userType;
  isAuthenticated: boolean;
};
export type AuthConextType = {
  isAuthenticated: boolean;
  user: userType;
  login: (email: string, password: string | number) => void;
  logout: () => void;
};

export type State = {
  cities: city[];
  isLoading: boolean;
  currentCity?: city;
  error: string;
};

export type citiesAction =
  | { type: "loading" }
  | { type: "cities/loaded"; payload: city[] }
  | { type: "cities/created"; payload: city }
  | { type: "cities/deleted"; payload: city }
  | { type: "rejected"; payload: string };
