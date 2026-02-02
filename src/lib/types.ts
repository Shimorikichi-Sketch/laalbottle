export type InstitutionType = 'bank' | 'government' | 'healthcare' | 'retail' | 'restaurant' | 'salon' | 'other';
export type ServiceType = 'queue' | 'appointment' | 'both';
export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled' | 'no_show';

export interface Institution {
  id: string;
  name: string;
  description: string | null;
  institution_type: InstitutionType;
  address: string;
  city: string;
  state: string | null;
  country: string;
  postal_code: string | null;
  latitude: number;
  longitude: number;
  geofence_radius_meters: number;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  opening_time: string;
  closing_time: string;
  working_days: string[];
  is_active: boolean;
  average_wait_time_minutes: number | null;
  current_queue_size: number | null;
  owner_id: string | null;
  created_at: string;
  updated_at: string;
  distance_km?: number;
}

export interface Service {
  id: string;
  institution_id: string;
  name: string;
  description: string | null;
  service_type: ServiceType;
  duration_minutes: number;
  price: number | null;
  is_active: boolean;
  max_queue_size: number | null;
  current_queue_position: number | null;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  institution_id: string;
  service_id: string;
  booking_type: ServiceType;
  status: BookingStatus;
  queue_number: number | null;
  scheduled_date: string | null;
  scheduled_time: string | null;
  estimated_wait_minutes: number | null;
  check_in_time: string | null;
  check_in_latitude: number | null;
  check_in_longitude: number | null;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  institution?: Institution;
  service?: Service;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  current_latitude: number | null;
  current_longitude: number | null;
  location_updated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  accuracy?: number;
}

export interface NearbyInstitution {
  id: string;
  name: string;
  description: string | null;
  institution_type: InstitutionType;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  distance_km: number;
  average_wait_time_minutes: number | null;
  current_queue_size: number | null;
  opening_time: string;
  closing_time: string;
  logo_url: string | null;
}
