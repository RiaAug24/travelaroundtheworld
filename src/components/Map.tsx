import { useNavigate, useSearchParams } from "react-router";
import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../context/CityContext";
import { city } from "../types/types";
import { useGeolocation } from "../hooks/useGeoLocation";
import Button from "./Button";

export default function Map() {
  const { cities } = useCities();
  const [searchParams] = useSearchParams();
  const [mapPosition, setMapPosition] = useState<LatLngExpression | undefined>([
    13.3409, 74.742,
  ]);
  const mapLat = parseFloat(searchParams.get("lat") ?? ""); // Added default value
  const mapLng = parseFloat(searchParams.get("lng") ?? ""); // Added default value
  const {
    isLoading: isLoadingPos,
    position: geoLocPos,
    getPosition,
  } = useGeolocation();
  useEffect(() => {
    if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (geoLocPos) setMapPosition(geoLocPos);
  }, [geoLocPos]);
  return (
    <div className={styles.mapContainer}>
      {!geoLocPos && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPos ? "Loading..." : "Use Your position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={13}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {cities.map((city: city) => (
          <Marker
            key={city.id}
            position={
              [city.position?.lat, city.position?.lng] as LatLngExpression
            }
          >
            <Popup>{city.notes}</Popup>
          </Marker>
        ))}
        <AdjustCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function AdjustCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return <></>;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
  return <></>;
}
