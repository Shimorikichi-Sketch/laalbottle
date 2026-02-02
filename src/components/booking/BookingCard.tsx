import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useBookings } from '@/hooks/useBookings';
import { useGeolocation } from '@/hooks/useGeolocation';
import type { Booking } from '@/lib/types';
import { format } from 'date-fns';
import { 
  MapPin, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Navigation,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface BookingCardProps {
  booking: Booking;
  onCheckIn?: () => void;
}

const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  pending: { 
    color: 'bg-yellow-500/10 text-yellow-600 border-yellow-200', 
    icon: <AlertCircle className="h-4 w-4" />, 
    label: 'Pending' 
  },
  confirmed: { 
    color: 'bg-blue-500/10 text-blue-600 border-blue-200', 
    icon: <Clock className="h-4 w-4" />, 
    label: 'Confirmed' 
  },
  checked_in: { 
    color: 'bg-green-500/10 text-green-600 border-green-200', 
    icon: <CheckCircle2 className="h-4 w-4" />, 
    label: 'Checked In' 
  },
  completed: { 
    color: 'bg-gray-500/10 text-gray-600 border-gray-200', 
    icon: <CheckCircle2 className="h-4 w-4" />, 
    label: 'Completed' 
  },
  cancelled: { 
    color: 'bg-red-500/10 text-red-600 border-red-200', 
    icon: <XCircle className="h-4 w-4" />, 
    label: 'Cancelled' 
  },
  no_show: { 
    color: 'bg-red-500/10 text-red-600 border-red-200', 
    icon: <XCircle className="h-4 w-4" />, 
    label: 'No Show' 
  },
};

export function BookingCard({ booking, onCheckIn }: BookingCardProps) {
  const { updateBookingStatus, cancelBooking } = useBookings();
  const { location, isWithinGeofence, refreshLocation } = useGeolocation();
  const { toast } = useToast();
  const [checkingIn, setCheckingIn] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const institution = booking.institution;
  const service = booking.service;
  const status = statusConfig[booking.status] || statusConfig.pending;

  const canCheckIn = ['pending', 'confirmed'].includes(booking.status);
  const canCancel = ['pending', 'confirmed'].includes(booking.status);

  const handleCheckIn = async () => {
    if (!location) {
      toast({
        title: 'Location required',
        description: 'Please enable location access to check in.',
        variant: 'destructive',
      });
      refreshLocation();
      return;
    }

    if (!institution) return;

    // Verify geofence
    const isInRange = isWithinGeofence(
      institution.latitude,
      institution.longitude,
      institution.geofence_radius_meters
    );

    if (!isInRange) {
      toast({
        title: 'Too far away',
        description: `Please move closer to ${institution.name} to check in. You need to be within ${institution.geofence_radius_meters}m.`,
        variant: 'destructive',
      });
      return;
    }

    setCheckingIn(true);
    const { error } = await updateBookingStatus(booking.id, 'checked_in', {
      latitude: location.latitude,
      longitude: location.longitude,
    });
    setCheckingIn(false);

    if (error) {
      toast({
        title: 'Check-in failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Checked in!',
        description: 'You have successfully checked in.',
      });
      onCheckIn?.();
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    const { error } = await cancelBooking(booking.id);
    setCancelling(false);

    if (error) {
      toast({
        title: 'Cancellation failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Booking cancelled',
        description: 'Your booking has been cancelled.',
      });
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{institution?.name || 'Unknown'}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {institution?.address || 'Unknown location'}
            </CardDescription>
          </div>
          <Badge className={cn("font-normal gap-1", status.color)}>
            {status.icon}
            {status.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2 text-sm">
          <Badge variant="outline">
            {service?.name || 'Unknown service'}
          </Badge>
          {booking.queue_number && (
            <Badge variant="secondary">
              Queue #{booking.queue_number}
            </Badge>
          )}
          {booking.scheduled_date && (
            <Badge variant="secondary" className="gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(booking.scheduled_date), 'PP')}
              {booking.scheduled_time && ` at ${booking.scheduled_time}`}
            </Badge>
          )}
        </div>

        {booking.booking_type === 'queue' && booking.estimated_wait_minutes && (
          <p className="text-sm text-muted-foreground">
            <Clock className="h-3 w-3 inline mr-1" />
            Estimated wait: ~{booking.estimated_wait_minutes} minutes
          </p>
        )}

        {booking.notes && (
          <p className="text-sm text-muted-foreground border-l-2 border-muted pl-3">
            {booking.notes}
          </p>
        )}
      </CardContent>

      {(canCheckIn || canCancel) && (
        <CardFooter className="gap-2 pt-0">
          {canCheckIn && (
            <Button 
              onClick={handleCheckIn} 
              className="flex-1 gap-2"
              disabled={checkingIn}
            >
              {checkingIn ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
              {checkingIn ? 'Checking in...' : 'Check In'}
            </Button>
          )}
          {canCancel && (
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Cancel'
              )}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

export function BookingCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
          <div className="h-6 bg-muted rounded w-20" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <div className="h-5 bg-muted rounded w-24" />
          <div className="h-5 bg-muted rounded w-16" />
        </div>
      </CardContent>
    </Card>
  );
}
