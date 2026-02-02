import { useNavigate, useParams } from 'react-router-dom';
import { useInstitution } from '@/hooks/useInstitutions';
import { useAuth } from '@/hooks/useAuth';
import { BookingForm } from '@/components/booking/BookingForm';
import { AuthForm } from '@/components/auth/AuthForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Globe, 
  Clock, 
  Users,
  Navigation
} from 'lucide-react';

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export default function InstitutionDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { institution, services, loading, error } = useInstitution(id || null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-6">
        <div className="container max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !institution) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Institution not found</h2>
          <p className="text-muted-foreground mb-4">The requested institution could not be found.</p>
          <Button onClick={() => navigate('/customer')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // If user is not logged in, show auth form
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-6">
        <div className="container max-w-md mx-auto space-y-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/customer')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>

          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-2">Sign in to book at</h2>
            <p className="text-lg text-primary font-medium">{institution.name}</p>
          </div>

          <AuthForm onSuccess={() => {}} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-6">
      <div className="container max-w-2xl mx-auto space-y-6">
        {/* Institution Header */}
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/customer')}
            className="gap-2 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>

          {institution.cover_image_url && (
            <div 
              className="h-48 rounded-xl bg-cover bg-center"
              style={{ backgroundImage: `url(${institution.cover_image_url})` }}
            />
          )}

          <div>
            <h1 className="text-2xl font-bold">{institution.name}</h1>
            
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="secondary" className="gap-1">
                <MapPin className="h-3 w-3" />
                {institution.city}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(institution.opening_time)} - {formatTime(institution.closing_time)}
              </Badge>
              {institution.current_queue_size !== null && institution.current_queue_size > 0 && (
                <Badge variant="secondary" className="gap-1">
                  <Users className="h-3 w-3" />
                  {institution.current_queue_size} in queue
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground mt-3 flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              {institution.address}
            </p>

            {institution.description && (
              <p className="text-sm text-muted-foreground mt-2">
                {institution.description}
              </p>
            )}

            <div className="flex flex-wrap gap-3 mt-4">
              {institution.phone && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`tel:${institution.phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </a>
                </Button>
              )}
              {institution.website && (
                <Button variant="outline" size="sm" asChild>
                  <a href={institution.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4 mr-2" />
                    Website
                  </a>
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${institution.latitude},${institution.longitude}`,
                    '_blank'
                  );
                }}
              >
                <Navigation className="h-4 w-4 mr-2" />
                Directions
              </Button>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <BookingForm
          institution={institution}
          services={services}
          onBack={() => navigate('/customer')}
          onSuccess={() => navigate('/bookings')}
        />
      </div>
    </div>
  );
}
