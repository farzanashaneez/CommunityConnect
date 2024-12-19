import React, { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker, Libraries } from '@react-google-maps/api';
import { Typography } from '@mui/material';

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const libraries: Libraries = ['places'];
const mapContainerStyle = {
  width: '70%',
  height: '300px',
};

interface MapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{ lat: number; lng: number }>;
  onMapClick?: (e: google.maps.MapMouseEvent) => void;
  onPlaceSelected?: (placeName: string) => void; // New prop for place name
}

const MapComponent: React.FC<MapProps> = ({ center, zoom = 10, markers = [], onMapClick, onPlaceSelected }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey || '',
    libraries,
  });
  const [locationName, setLocationName] = useState<string>(''); // State to store the location name

  // Ensure geocoding happens after API is loaded
  useEffect(() => {
    if (isLoaded && center.lat && center.lng) {
      const geocoder = new google.maps.Geocoder(); // Access google only after it's loaded

      geocoder.geocode({ location: center }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
          const placeName = results[0].formatted_address; // Get formatted address
          setLocationName(placeName); // Update state with the location name
          if (onPlaceSelected) {
            onPlaceSelected(placeName); // Call the parent callback with the place name
          }
        } else {
          console.error("Geocoder failed due to:", status);
        }
      });
    }
  }, [center, isLoaded, onPlaceSelected]); // Trigger effect when center or isLoaded changes

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (onMapClick) {
      onMapClick(e); // Pass the map click event to the parent
    }

    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const geocoder = new google.maps.Geocoder();

      // Fetch place details using Geocoder
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
          const placeName = results[0].formatted_address; // Get formatted address
          if (onPlaceSelected) {
            onPlaceSelected(placeName); // Call the parent callback with the place name
          }
        } else {
          console.error("Geocoder failed due to:", status);
        }
      });
    }
  };

  return (
    <div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={zoom}
        center={center}
        onClick={handleMapClick} // Use the new handleMapClick function
      >
        {markers.map((marker, index) => (
          <Marker key={index} position={marker} />
        ))}
      </GoogleMap>
      <Typography variant="body2" sx={{width:'60%'}}>Location: {locationName}</Typography> {/* Show selected place */}

    </div>
  );
};

export default MapComponent;
