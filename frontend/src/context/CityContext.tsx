import React, { createContext, ReactNode, useEffect, useReducer } from "react";
import { city, CityContexType, State } from "../../../types/types";
import { useQuery, useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

const ALL_CITIES_QUERY = gql`
  query FetchAllCities {
    getAllCities {
      id
      cityName
      country
      emoji
      date
      notes
      latitude
      longitude
      userId
    }
  }
`;

const CREATE_CITY = gql`
  mutation CreateCityMutation(
    $cityName: String!
    $country: String!
    $latitude: Float!
    $longitude: Float!
    $emoji: String
    $date: String
    $notes: String
  ) {
    createCity(
      cityName: $cityName
      country: $country
      latitude: $latitude
      longitude: $longitude
      emoji: $emoji
      date: $date
      notes: $notes
    ) {
      id
      cityName
      country
      emoji
      date
      notes
      latitude
      longitude
      userId
    }
  }
`;

const DELETE_CITY = gql`
  mutation DeleteCityMutation($deleteCityId: ID!) {
    deleteCity(id: $deleteCityId) {
      id
      cityName
      country
      emoji
      date
      notes
      latitude
      longitude
      userId
    }
  }
`;

const CityContext = createContext<CityContexType>({} as CityContexType);

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action): State {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };

    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
        error: "",
      };

    case "cities/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
        isLoading: false,
        error: "",
      };

    case "cities/deleted":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };

    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      throw new Error("Unknown action type");
  }
}

function CityProvider({ children }: { children: ReactNode }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const { data } = useQuery(ALL_CITIES_QUERY);
  const [createCityMutation] = useMutation(CREATE_CITY);
  const [deleteCityMutation] = useMutation(DELETE_CITY);
  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        dispatch({ type: "cities/loaded", payload: data.getAllCities });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading the data",
        });
      }
    }
    fetchCities();
    console.log(cities);
  }, [cities]);

  async function createCity(newcity: city) {
    dispatch({ type: "loading" });
    try {
      const { data } = await createCityMutation({
        variables: {
          newcity,
        },
      });
      dispatch({ type: "cities/created", payload: data.createCity });
    } catch {
      dispatch({
        type: "rejected",
        payload: "Error while creating the city!",
      });
    }
  }

  async function deleteCity(id: string | undefined) {
    dispatch({ type: "loading" });
    try {
      const { data } = await deleteCityMutation({
        variables: {
          deleteCityId: id,
        },
      });
      console.log(data.deleteCity);
      dispatch({
        type: "cities/deleted",
        payload: cities.filter((city: city) => city.id != id),
      });
    } catch {
      dispatch({ type: "rejected", payload: "Error while deleting the city" });
    }
  }

  return (
    <CityContext.Provider
      value={{
        cities: cities,
        isLoading: isLoading,
        currentCity: currentCity,
        createCity: createCity,
        deleteCity: deleteCity,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

function useCities() {
  const context = React.useContext(CityContext);
  if (context === undefined) {
    throw new Error("useCities Accessed outside of Context provider!");
  }
  return context;
}

export { CityProvider, useCities };
