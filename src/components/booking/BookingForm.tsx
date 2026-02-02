import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useBookings } from '@/hooks/useBookings';
import { useAuth } from '@/hooks/useAuth';
import type { Institution, Service } from '@/lib/types';
import { format } from 'date-fns';
import { 
  Clock, 
  Users, 
  Calendar as CalendarIcon, 
  IndianRupee,
  Loader2,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookingFormProps {
  institution: Institution;
  services: Service[];
  onBack: () => void;
  onSuccess: () => void;
}

export function BookingForm({ institution, services, onBack, onSuccess }: BookingFormProps) {
  const { user } = useAuth();
  const { createBooking } = useBookings();
  const { toast } = useToast();

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingType, setBookingType] = useState<'queue' | 'appointment'>('queue');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Generate time slots
  const generateTimeSlots = () => {
    const slots: string[] = [];
    const [openHour] = institution.opening_time.split(':').map(Number);
    const [closeHour] = institution.closing_time.split(':').map(Number);
    
    for (let hour = openHour; hour < closeHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    
    return slots;
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to create a booking.',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedService) {
      toast({
        title: 'Select a service',
        description: 'Please select a service to continue.',
        variant: 'destructive',
      });
      return;
    }

    if (bookingType === 'appointment' && (!selectedDate || !selectedTime)) {
      toast({
        title: 'Select date and time',
        description: 'Please select an appointment date and time.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    const { booking, error } = await createBooking({
      institution_id: institution.id,
      service_id: selectedService.id,
      booking_type: bookingType,
      scheduled_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined,
      scheduled_time: selectedTime || undefined,
      notes: notes || undefined,
    });

    setLoading(false);

    if (error) {
      toast({
        title: 'Booking failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setSuccess(true);
      toast({
        title: bookingType === 'queue' ? 'You\'re in the queue!' : 'Appointment booked!',
        description: bookingType === 'queue' 
          ? `Your queue number is ${booking?.queue_number}` 
          : `Scheduled for ${format(selectedDate!, 'PPP')} at ${selectedTime}`,
      });
      setTimeout(onSuccess, 2000);
    }
  };

  if (success) {
    return (
      <Card className="border-0 shadow-xl">
        <CardContent className="pt-10 pb-10 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-muted-foreground">
            {bookingType === 'queue' 
              ? 'You have been added to the queue.' 
              : 'Your appointment has been scheduled.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="w-fit -ml-2 mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <CardTitle>{institution.name}</CardTitle>
        <CardDescription>{institution.address}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Service Selection */}
        <div className="space-y-3">
          <h3 className="font-semibold">Select Service</h3>
          <div className="grid gap-2">
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => {
                  setSelectedService(service);
                  if (service.service_type !== 'both') {
                    setBookingType(service.service_type as 'queue' | 'appointment');
                  }
                }}
                className={cn(
                  "p-4 rounded-lg border cursor-pointer transition-all",
                  selectedService?.id === service.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "hover:border-primary/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{service.name}</h4>
                    {service.description && (
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {service.duration_minutes} min
                      </Badge>
                      {service.service_type === 'queue' && (
                        <Badge variant="secondary" className="text-xs">Queue</Badge>
                      )}
                      {service.service_type === 'appointment' && (
                        <Badge variant="secondary" className="text-xs">Appointment</Badge>
                      )}
                      {service.service_type === 'both' && (
                        <Badge variant="secondary" className="text-xs">Queue or Appointment</Badge>
                      )}
                    </div>
                  </div>
                  {service.price && (
                    <div className="text-right">
                      <span className="flex items-center text-lg font-semibold">
                        <IndianRupee className="h-4 w-4" />
                        {service.price}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Type Selection (if service supports both) */}
        {selectedService?.service_type === 'both' && (
          <div className="space-y-3">
            <h3 className="font-semibold">Booking Type</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={bookingType === 'queue' ? 'default' : 'outline'}
                onClick={() => setBookingType('queue')}
                className="h-auto py-4 flex-col gap-2"
              >
                <Users className="h-5 w-5" />
                <span>Join Queue</span>
                <span className="text-xs opacity-80">Walk in now</span>
              </Button>
              <Button
                variant={bookingType === 'appointment' ? 'default' : 'outline'}
                onClick={() => setBookingType('appointment')}
                className="h-auto py-4 flex-col gap-2"
              >
                <CalendarIcon className="h-5 w-5" />
                <span>Book Appointment</span>
                <span className="text-xs opacity-80">Schedule for later</span>
              </Button>
            </div>
          </div>
        )}

        {/* Appointment Date/Time Selection */}
        {(bookingType === 'appointment' || selectedService?.service_type === 'appointment') && (
          <div className="space-y-3">
            <h3 className="font-semibold">Select Date & Time</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {generateTimeSlots().map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="space-y-3">
          <h3 className="font-semibold">Notes (Optional)</h3>
          <Textarea
            placeholder="Any special requests or notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          className="w-full"
          size="lg"
          disabled={!selectedService || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : bookingType === 'queue' ? (
            'Join Queue'
          ) : (
            'Book Appointment'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
