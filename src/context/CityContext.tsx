import React, { createContext, ReactNode, useEffect, useState } from "react";
import { city, CityContexType } from "../types/types";

const CityContext = createContext<CityContexType>({} as CityContexType);
const BASE_URL = "http://localhost:8000";
function CityProvider({ children }: { children: ReactNode }) {
  const [cities, setCities] = useState<city[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchCities() {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/cities`);
        const data = await response.json();
        console.log(data);
        setCities(data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
    console.log(cities);
  }, []);

  async function createCity(newcity: city) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newcity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setCities((cities: city[]) => [...cities, data] as city[]);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  async function deleteCity(id: string) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      if(!res.ok) throw new Error;
      
      setCities((cities) => cities.filter((city: city) => city.id !== id));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CityContext.Provider
      value={{
        cities: cities,
        isLoading: isLoading,
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
