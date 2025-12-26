import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2 } from 'lucide-react';

interface BulkAction {
  value: string;
  label: string;
  variant?: 'default' | 'destructive';
  icon?: React.ReactNode;
}

interface BulkActionsProps {
  selectedCount: number;
  actions: BulkAction[];
  onAction: (action: string) => void;
  onClearSelection: () => void;
}

export const BulkActions = ({
  selectedCount,
  actions,
  onAction,
  onClearSelection,
}: BulkActionsProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-4 rounded-lg border bg-muted/50 p-4">
      <p className="text-sm font-medium">
        {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
      </p>

      <div className="flex flex-1 items-center gap-2">
        <Select onValueChange={onAction}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Bulk actions" />
          </SelectTrigger>
          <SelectContent>
            {actions.map((action) => (
              <SelectItem key={action.value} value={action.value}>
                {action.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button variant="ghost" size="sm" onClick={onClearSelection}>
        Clear selection
      </Button>
    </div>
  );
};
