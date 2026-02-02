import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { InstitutionType } from '@/lib/types';
import { 
  Landmark, 
  Building2, 
  Stethoscope, 
  Store, 
  Utensils, 
  Scissors,
  LayoutGrid 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface InstitutionFilterProps {
  selectedType: InstitutionType | null;
  onTypeChange: (type: InstitutionType | null) => void;
}

const filterOptions: { type: InstitutionType | null; label: string; icon: React.ReactNode }[] = [
  { type: null, label: 'All', icon: <LayoutGrid className="h-4 w-4" /> },
  { type: 'bank', label: 'Banks', icon: <Landmark className="h-4 w-4" /> },
  { type: 'healthcare', label: 'Healthcare', icon: <Stethoscope className="h-4 w-4" /> },
  { type: 'government', label: 'Government', icon: <Building2 className="h-4 w-4" /> },
  { type: 'retail', label: 'Retail', icon: <Store className="h-4 w-4" /> },
  { type: 'salon', label: 'Salon', icon: <Scissors className="h-4 w-4" /> },
  { type: 'restaurant', label: 'Restaurant', icon: <Utensils className="h-4 w-4" /> },
];

export function InstitutionFilter({ selectedType, onTypeChange }: InstitutionFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filterOptions.map(({ type, label, icon }) => (
        <Button
          key={label}
          variant={selectedType === type ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeChange(type)}
          className={cn(
            "gap-2 transition-all",
            selectedType === type && "shadow-md"
          )}
        >
          {icon}
          <span className="hidden sm:inline">{label}</span>
        </Button>
      ))}
    </div>
  );
}
