import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Clock, 
  Users, 
  Building2, 
  Stethoscope, 
  Landmark, 
  Store, 
  Utensils, 
  Scissors,
  ChevronRight 
} from 'lucide-react';
import type { NearbyInstitution, InstitutionType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface InstitutionCardProps {
  institution: NearbyInstitution;
  onClick?: () => void;
  showDistance?: boolean;
}

const institutionIcons: Record<InstitutionType, React.ReactNode> = {
  bank: <Landmark className="h-5 w-5" />,
  government: <Building2 className="h-5 w-5" />,
  healthcare: <Stethoscope className="h-5 w-5" />,
  retail: <Store className="h-5 w-5" />,
  restaurant: <Utensils className="h-5 w-5" />,
  salon: <Scissors className="h-5 w-5" />,
  other: <Building2 className="h-5 w-5" />,
};

const institutionColors: Record<InstitutionType, string> = {
  bank: 'bg-blue-500/10 text-blue-600 border-blue-200',
  government: 'bg-amber-500/10 text-amber-600 border-amber-200',
  healthcare: 'bg-red-500/10 text-red-600 border-red-200',
  retail: 'bg-green-500/10 text-green-600 border-green-200',
  restaurant: 'bg-orange-500/10 text-orange-600 border-orange-200',
  salon: 'bg-pink-500/10 text-pink-600 border-pink-200',
  other: 'bg-gray-500/10 text-gray-600 border-gray-200',
};

function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function InstitutionCard({ institution, onClick, showDistance = true }: InstitutionCardProps) {
  const icon = institutionIcons[institution.institution_type];
  const colorClass = institutionColors[institution.institution_type];

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        "border-l-4",
        colorClass.split(' ').find(c => c.startsWith('border-'))
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", colorClass)}>
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {institution.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {institution.address}
              </CardDescription>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {showDistance && institution.distance_km > 0 && (
            <Badge variant="secondary" className="font-normal">
              <MapPin className="h-3 w-3 mr-1" />
              {formatDistance(institution.distance_km)}
            </Badge>
          )}
          <Badge variant="secondary" className="font-normal">
            <Clock className="h-3 w-3 mr-1" />
            {formatTime(institution.opening_time)} - {formatTime(institution.closing_time)}
          </Badge>
          {institution.current_queue_size !== null && institution.current_queue_size > 0 && (
            <Badge variant="secondary" className="font-normal">
              <Users className="h-3 w-3 mr-1" />
              {institution.current_queue_size} in queue
            </Badge>
          )}
          {institution.average_wait_time_minutes && (
            <Badge variant="outline" className="font-normal">
              ~{institution.average_wait_time_minutes} min wait
            </Badge>
          )}
        </div>
        {institution.description && (
          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
            {institution.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function InstitutionCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-muted rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <div className="h-5 bg-muted rounded w-16" />
          <div className="h-5 bg-muted rounded w-24" />
          <div className="h-5 bg-muted rounded w-20" />
        </div>
      </CardContent>
    </Card>
  );
}
