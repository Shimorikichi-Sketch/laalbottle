import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useBookings } from '@/hooks/useBookings';
import { BookingCard, BookingCardSkeleton } from '@/components/booking/BookingCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  CalendarCheck, 
  Clock, 
  CheckCircle2,
  History
} from 'lucide-react';

export default function MyBookings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookings, loading, refetch } = useBookings();

  // Separate bookings by status
  const activeBookings = bookings.filter(b => 
    ['pending', 'confirmed', 'checked_in'].includes(b.status)
  );
  const pastBookings = bookings.filter(b => 
    ['completed', 'cancelled', 'no_show'].includes(b.status)
  );

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/customer')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">My Bookings</h1>
              <p className="text-sm text-muted-foreground">
                Manage your queue positions and appointments
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container py-6">
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="active" className="gap-2">
              <Clock className="h-4 w-4" />
              Active ({activeBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="gap-2">
              <History className="h-4 w-4" />
              Past ({pastBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {loading ? (
              <>
                <BookingCardSkeleton />
                <BookingCardSkeleton />
              </>
            ) : activeBookings.length === 0 ? (
              <div className="text-center py-12">
                <CalendarCheck className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No active bookings</h3>
                <p className="text-muted-foreground mb-4">
                  You don't have any active bookings right now.
                </p>
                <Button onClick={() => navigate('/customer')}>
                  Find Services
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {activeBookings.map((booking) => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking}
                    onCheckIn={refetch}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {loading ? (
              <>
                <BookingCardSkeleton />
                <BookingCardSkeleton />
              </>
            ) : pastBookings.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No past bookings</h3>
                <p className="text-muted-foreground">
                  Your completed bookings will appear here.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {pastBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
