import { useSearchParams } from "react-router";

function useURLPosition() {
  const [searchParams] = useSearchParams();
  const mapLat = parseFloat(searchParams.get("lat") ?? ""); // Added default value
  const mapLng = parseFloat(searchParams.get("lng") ?? "");

  return [mapLat, mapLng];
}

export default useURLPosition;
