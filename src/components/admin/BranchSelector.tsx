import React from 'react';
import { useBranch } from '@/contexts/BranchContext';
import {
  Select,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { Building2 } from 'lucide-react';

export const BranchSelector: React.FC = () => {
  const { branches, selectedBranch, isAllBranches, setSelectedBranch, setIsAllBranches, isLoading } = useBranch();

  if (isLoading || branches.length === 0) {
    return null;
  }

  const handleValueChange = (value: string) => {
    if (value === 'all') {
      setIsAllBranches(true);
    } else {
      const branch = branches.find((b) => b.id === value);
      if (branch) {
        setSelectedBranch(branch);
      }
    }
  };

  const currentValue = isAllBranches ? 'all' : selectedBranch?.id || '';

  return (
    <div className="flex items-center gap-2">
      <Building2 className="h-5 w-5 text-muted-foreground" />
      <Select value={currentValue} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[200px]">
          <SelectItem value="all">All Branches</SelectItem>
          {branches.map((branch) => (
            <SelectItem key={branch.id} value={branch.id}>
              {branch.name}
            </SelectItem>
          ))}
        </SelectTrigger>
      </Select>
    </div>
  );
};
