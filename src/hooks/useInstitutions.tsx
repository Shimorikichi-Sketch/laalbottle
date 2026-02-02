import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Institution, Service, NearbyInstitution, InstitutionType } from '@/lib/types';
import { calculateDistance } from './useGeolocation';

interface UseInstitutionsOptions {
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  type?: InstitutionType | null;
  city?: string;
}

export function useInstitutions(options: UseInstitutionsOptions = {}) {
  const [institutions, setInstitutions] = useState<NearbyInstitution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInstitutions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('institutions')
        .select('*')
        .eq('is_active', true);

      // Filter by city if provided and no coordinates
      if (options.city && (!options.latitude || !options.longitude)) {
        query = query.ilike('city', `%${options.city}%`);
      }

      // Filter by type if provided
      if (options.type) {
        query = query.eq('institution_type', options.type);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      let processedData = (data || []).map(inst => {
        let distance_km = 0;
        
        if (options.latitude && options.longitude) {
          distance_km = calculateDistance(
            options.latitude,
            options.longitude,
            inst.latitude,
            inst.longitude
          );
        }

        return {
          id: inst.id,
          name: inst.name,
          description: inst.description,
          institution_type: inst.institution_type as InstitutionType,
          address: inst.address,
          city: inst.city,
          latitude: inst.latitude,
          longitude: inst.longitude,
          distance_km,
          average_wait_time_minutes: inst.average_wait_time_minutes,
          current_queue_size: inst.current_queue_size,
          opening_time: inst.opening_time,
          closing_time: inst.closing_time,
          logo_url: inst.logo_url,
        } as NearbyInstitution;
      });

      // Filter by radius if coordinates provided
      if (options.latitude && options.longitude && options.radiusKm) {
        processedData = processedData.filter(
          inst => inst.distance_km <= options.radiusKm!
        );
      }

      // Sort by distance if coordinates provided
      if (options.latitude && options.longitude) {
        processedData.sort((a, b) => a.distance_km - b.distance_km);
      }

      setInstitutions(processedData);
    } catch (err) {
      console.error('Error fetching institutions:', err);
      setError('Failed to fetch institutions');
    } finally {
      setLoading(false);
    }
  }, [options.latitude, options.longitude, options.radiusKm, options.type, options.city]);

  useEffect(() => {
    fetchInstitutions();
  }, [fetchInstitutions]);

  return {
    institutions,
    loading,
    error,
    refetch: fetchInstitutions,
  };
}

export function useInstitution(id: string | null) {
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [instResult, servicesResult] = await Promise.all([
          supabase
            .from('institutions')
            .select('*')
            .eq('id', id)
            .single(),
          supabase
            .from('services')
            .select('*')
            .eq('institution_id', id)
            .eq('is_active', true),
        ]);

        if (instResult.error) throw instResult.error;
        if (servicesResult.error) throw servicesResult.error;

        setInstitution(instResult.data as Institution);
        setServices(servicesResult.data as Service[]);
      } catch (err) {
        console.error('Error fetching institution:', err);
        setError('Failed to fetch institution details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return {
    institution,
    services,
    loading,
    error,
  };
}
