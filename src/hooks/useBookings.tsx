import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Booking, BookingStatus, ServiceType } from '@/lib/types';

interface CreateBookingParams {
  institution_id: string;
  service_id: string;
  booking_type: ServiceType;
  scheduled_date?: string;
  scheduled_time?: string;
  notes?: string;
}

export function useBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select(`
          *,
          institution:institutions(*),
          service:services(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setBookings(data as unknown as Booking[]);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const createBooking = async (params: CreateBookingParams): Promise<{ booking: Booking | null; error: Error | null }> => {
    if (!user) {
      return { booking: null, error: new Error('Please sign in to create a booking') };
    }

    try {
      // Get the current queue position for queue bookings
      let queueNumber = null;
      if (params.booking_type === 'queue') {
        const { data: service } = await supabase
          .from('services')
          .select('current_queue_position')
          .eq('id', params.service_id)
          .single();
        
        queueNumber = (service?.current_queue_position || 0) + 1;

        // Update the service's current queue position
        await supabase
          .from('services')
          .update({ current_queue_position: queueNumber })
          .eq('id', params.service_id);
      }

      const { data, error: insertError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          institution_id: params.institution_id,
          service_id: params.service_id,
          booking_type: params.booking_type,
          status: params.booking_type === 'queue' ? 'confirmed' : 'pending',
          queue_number: queueNumber,
          scheduled_date: params.scheduled_date || null,
          scheduled_time: params.scheduled_time || null,
          notes: params.notes || null,
        })
        .select(`
          *,
          institution:institutions(*),
          service:services(*)
        `)
        .single();

      if (insertError) throw insertError;

      const newBooking = data as unknown as Booking;
      setBookings(prev => [newBooking, ...prev]);

      return { booking: newBooking, error: null };
    } catch (err) {
      console.error('Error creating booking:', err);
      return { booking: null, error: err as Error };
    }
  };

  const updateBookingStatus = async (
    bookingId: string, 
    status: BookingStatus,
    checkInData?: { latitude: number; longitude: number }
  ): Promise<{ error: Error | null }> => {
    try {
      const updates: Record<string, unknown> = { status };
      
      if (status === 'checked_in' && checkInData) {
        updates.check_in_time = new Date().toISOString();
        updates.check_in_latitude = checkInData.latitude;
        updates.check_in_longitude = checkInData.longitude;
      }
      
      if (status === 'completed') {
        updates.completed_at = new Date().toISOString();
      }

      const { error: updateError } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', bookingId);

      if (updateError) throw updateError;

      setBookings(prev =>
        prev.map(b =>
          b.id === bookingId ? { ...b, ...updates } as Booking : b
        )
      );

      return { error: null };
    } catch (err) {
      console.error('Error updating booking:', err);
      return { error: err as Error };
    }
  };

  const cancelBooking = async (bookingId: string): Promise<{ error: Error | null }> => {
    return updateBookingStatus(bookingId, 'cancelled');
  };

  return {
    bookings,
    loading,
    error,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    refetch: fetchBookings,
  };
}
