import { MapPin, Navigation, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { UserLocation } from '@/lib/types';
import { cn } from '@/lib/utils';

interface LocationDisplayProps {
  location: UserLocation | null;
  loading: boolean;
  error: string | null;
  permissionDenied: boolean;
  onRefresh: () => void;
}

export function LocationDisplay({ 
  location, 
  loading, 
  error, 
  permissionDenied, 
  onRefresh 
}: LocationDisplayProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
        <Navigation className="h-4 w-4" />
        <span>Detecting your location...</span>
      </div>
    );
  }

  if (error || permissionDenied) {
    return (
      <Alert variant="destructive" className="bg-destructive/5">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error || 'Location access denied'}</span>
          <Button variant="outline" size="sm" onClick={onRefresh} className="ml-2">
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (location) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="secondary" className="gap-1 py-1.5">
          <MapPin className="h-3.5 w-3.5" />
          <span className="font-medium">{location.city || 'Unknown location'}</span>
        </Badge>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRefresh}
          className="h-7 px-2 text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return null;
}

interface LocationBannerProps {
  city?: string;
  onChangeLocation?: () => void;
}

export function LocationBanner({ city, onChangeLocation }: LocationBannerProps) {
  return (
    <div className="bg-primary/5 border-b border-primary/10 py-2 px-4">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-primary" />
          <span>
            Showing services in <strong>{city || 'your area'}</strong>
          </span>
        </div>
        {onChangeLocation && (
          <Button variant="link" size="sm" onClick={onChangeLocation}>
            Change
          </Button>
        )}
      </div>
    </div>
  );
}
