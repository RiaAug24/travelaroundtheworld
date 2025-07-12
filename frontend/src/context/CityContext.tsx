import React, { createContext, ReactNode, useEffect, useReducer } from "react";
import { Action, city, CityContexType, State } from "../types/types";

const CityContext = createContext<CityContexType>({} as CityContexType);
const BASE_URL = process.env.BASE_URL;

const initialState: State = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state: State, action: Action): State {
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

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const response = await fetch(`${BASE_URL}/cities`);
        const data = await response.json();
        console.log(data);
        dispatch({ type: "cities/loaded", payload: data });
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

  async function fetchUserCities() {
    dispatch({type: "loading"});
    try {
      // Todo
    } catch {
      dispatch({
          type: "rejected",
          payload: "There was an error loading the data",
        });
    }
  }

  async function createCity(newcity: city) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newcity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "cities/created", payload: data });
    } catch {
      dispatch({
          type: "rejected",
          payload: "Error while creating the city!",
        });
    }
  }

  async function deleteCity(id: string| undefined) {
    try {
      dispatch({ type: "loading" });

      const res = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
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
