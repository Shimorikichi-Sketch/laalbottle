import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthForm } from '@/components/auth/AuthForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Building2, Construction } from 'lucide-react';

export default function InstitutionDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-6">
        <div className="container max-w-md mx-auto space-y-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="text-center mb-6">
            <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Institution Login</h2>
            <p className="text-muted-foreground">Sign in to manage your institution</p>
          </div>

          <AuthForm onSuccess={() => {}} />
        </div>
      </div>
    );
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
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Institution Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Manage your services and bookings
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container py-12">
        <Card className="max-w-lg mx-auto">
          <CardHeader className="text-center">
            <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-amber-500/10 flex items-center justify-center">
              <Construction className="h-8 w-8 text-amber-600" />
            </div>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              The institution management dashboard is currently under development.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-6">
              Soon you'll be able to:
            </p>
            <ul className="text-sm space-y-2 mb-6">
              <li>• Create and manage your institution</li>
              <li>• Add and configure services</li>
              <li>• View and manage bookings</li>
              <li>• Track customer flow in real-time</li>
              <li>• Analyze performance metrics</li>
            </ul>
            <Button onClick={() => navigate('/customer')}>
              Explore as Customer
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
