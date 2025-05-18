import emojiFlags from "emoji-flags";
import City from "../components/City";

export type city = {
  cityName?: string;
  country?: string;
  emoji?: emojiFlags;
  date?: string;
  notes?: string;
  position?: {
    lat?: number;
    lng?: number;
  };
  id?: number;
};

export type CityContexType = {
  cities: City[];
  isLoading: boolean;
};
