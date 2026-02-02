import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useInstitutions } from '@/hooks/useInstitutions';
import { useAuth } from '@/hooks/useAuth';
import { InstitutionCard, InstitutionCardSkeleton } from '@/components/institutions/InstitutionCard';
import { InstitutionFilter } from '@/components/institutions/InstitutionFilter';
import { LocationDisplay, LocationBanner } from '@/components/location/LocationDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Search, 
  User, 
  CalendarCheck, 
  LogOut, 
  MapPin,
  Building2,
  Sparkles
} from 'lucide-react';
import type { InstitutionType } from '@/lib/types';

export default function CustomerHome() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { location, loading: locationLoading, error: locationError, permissionDenied, refreshLocation } = useGeolocation();
  
  const [selectedType, setSelectedType] = useState<InstitutionType | null>(null);
  const [searchRadius, setSearchRadius] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const { institutions, loading: institutionsLoading } = useInstitutions({
    latitude: location?.latitude,
    longitude: location?.longitude,
    radiusKm: searchRadius,
    type: selectedType,
    city: location?.city,
  });

  // Filter by search query
  const filteredInstitutions = institutions.filter(inst =>
    !searchQuery || 
    inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  MyTurn
                </h1>
                <p className="text-xs text-muted-foreground">Skip the wait</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/bookings')}
                    className="gap-2"
                  >
                    <CalendarCheck className="h-4 w-4" />
                    <span className="hidden sm:inline">My Bookings</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/profile')}
                    className="gap-2"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{profile?.full_name || 'Profile'}</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={signOut}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Location Banner */}
      {location?.city && (
        <LocationBanner city={location.city} />
      )}

      {/* Main Content */}
      <main className="container py-6 space-y-6">
        {/* Location & Search Section */}
        <div className="space-y-4">
          <LocationDisplay
            location={location}
            loading={locationLoading}
            error={locationError}
            permissionDenied={permissionDenied}
            onRefresh={refreshLocation}
          />

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services, places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {location && (
              <div className="flex items-center gap-3 min-w-[200px]">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <Slider
                  value={[searchRadius]}
                  onValueChange={([value]) => setSearchRadius(value)}
                  min={1}
                  max={50}
                  step={1}
                  className="flex-1"
                />
                <Badge variant="outline" className="shrink-0">
                  {searchRadius} km
                </Badge>
              </div>
            )}
          </div>

          {/* Filter Chips */}
          <InstitutionFilter
            selectedType={selectedType}
            onTypeChange={setSelectedType}
          />
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {selectedType 
                ? `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Services` 
                : 'Nearby Services'}
            </h2>
            <Badge variant="secondary">
              {filteredInstitutions.length} found
            </Badge>
          </div>

          {institutionsLoading || locationLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <InstitutionCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredInstitutions.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No services found</h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? 'Try a different search term'
                  : location 
                    ? 'Try increasing the search radius'
                    : 'Enable location to see nearby services'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredInstitutions.map((institution) => (
                <InstitutionCard
                  key={institution.id}
                  institution={institution}
                  onClick={() => navigate(`/institution/${institution.id}`)}
                  showDistance={!!location}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
