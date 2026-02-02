import { useState, useEffect, useCallback } from 'react';
import type { UserLocation } from '@/lib/types';

interface GeolocationState {
  location: UserLocation | null;
  loading: boolean;
  error: string | null;
  permissionDenied: boolean;
}

const INDIAN_CITIES: Record<string, { lat: number; lon: number }> = {
  'Chandigarh': { lat: 30.7333, lon: 76.7794 },
  'Delhi': { lat: 28.6139, lon: 77.2090 },
  'Mumbai': { lat: 19.0760, lon: 72.8777 },
  'Bangalore': { lat: 12.9716, lon: 77.5946 },
  'Chennai': { lat: 13.0827, lon: 80.2707 },
  'Kolkata': { lat: 22.5726, lon: 88.3639 },
  'Hyderabad': { lat: 17.3850, lon: 78.4867 },
  'Pune': { lat: 18.5204, lon: 73.8567 },
};

// Reverse geocoding to get city name
async function getCityFromCoordinates(lat: number, lon: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const data = await response.json();
    
    // Extract city from address
    const address = data.address;
    const city = address.city || address.town || address.village || address.state_district || address.state;
    
    return city || 'Unknown';
  } catch (error) {
    console.error('Error getting city:', error);
    return 'Unknown';
  }
}

// Calculate distance between two points
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Find nearest city from coordinates
function findNearestCity(lat: number, lon: number): string {
  let nearestCity = 'Unknown';
  let minDistance = Infinity;

  for (const [city, coords] of Object.entries(INDIAN_CITIES)) {
    const distance = calculateDistance(lat, lon, coords.lat, coords.lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = city;
    }
  }

  return nearestCity;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: true,
    error: null,
    permissionDenied: false,
  });

  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by your browser',
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000, // Cache for 1 minute
        });
      });

      const { latitude, longitude, accuracy } = position.coords;
      
      // First set location with coordinates, then get city name
      let city = findNearestCity(latitude, longitude);
      
      // Try to get more accurate city name from reverse geocoding
      try {
        const geocodedCity = await getCityFromCoordinates(latitude, longitude);
        if (geocodedCity !== 'Unknown') {
          city = geocodedCity;
        }
      } catch (e) {
        // Use the nearest city from our list
      }

      setState({
        location: { latitude, longitude, city, accuracy },
        loading: false,
        error: null,
        permissionDenied: false,
      });
    } catch (error) {
      const geoError = error as GeolocationPositionError;
      
      if (geoError.code === geoError.PERMISSION_DENIED) {
        setState({
          location: null,
          loading: false,
          error: 'Location permission denied. Please enable location access.',
          permissionDenied: true,
        });
      } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
        setState({
          location: null,
          loading: false,
          error: 'Location unavailable. Please check your GPS.',
          permissionDenied: false,
        });
      } else {
        setState({
          location: null,
          loading: false,
          error: 'Unable to get your location. Please try again.',
          permissionDenied: false,
        });
      }
    }
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  const isWithinGeofence = useCallback((institutionLat: number, institutionLon: number, radiusMeters: number): boolean => {
    if (!state.location) return false;
    
    const distanceKm = calculateDistance(
      state.location.latitude,
      state.location.longitude,
      institutionLat,
      institutionLon
    );
    
    return distanceKm * 1000 <= radiusMeters;
  }, [state.location]);

  return {
    ...state,
    refreshLocation: getCurrentLocation,
    isWithinGeofence,
  };
}
