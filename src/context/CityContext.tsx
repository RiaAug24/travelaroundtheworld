import React, { createContext, ReactNode, useEffect, useState } from "react";
import { CityContexType } from "../types/types";

const CityContext = createContext<CityContexType>({} as CityContexType);
const BASE_URL = "http://localhost:8000";
function CityProvider({ children }: { children: ReactNode }) {
  const [cities, setCities] = useState([]);
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

  return (
    <CityContext.Provider value={{ cities: cities, isLoading: isLoading }}>
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
