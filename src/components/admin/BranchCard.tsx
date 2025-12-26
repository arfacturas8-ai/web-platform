import React from 'react';
import { type Branch } from '@/services/branchService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Phone, Mail, Edit, Trash2 } from 'lucide-react';

interface BranchCardProps {
  branch: Branch;
  onEdit: (branch: Branch) => void;
  onDelete: (branch: Branch) => void;
}

export const BranchCard: React.FC<BranchCardProps> = ({ branch, onEdit, onDelete }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle>{branch.name}</CardTitle>
          </div>
          <Badge variant={branch.is_active ? 'default' : 'secondary'}>
            {branch.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        {branch.city && branch.state && (
          <CardDescription>
            {branch.city}, {branch.state}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {branch.address && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">
                {branch.address}
                {branch.city && `, ${branch.city}`}
                {branch.state && `, ${branch.state}`}
                {branch.postal_code && ` ${branch.postal_code}`}
              </span>
            </div>
          )}

          {branch.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{branch.phone}</span>
            </div>
          )}

          {branch.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{branch.email}</span>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(branch)}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(branch)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
