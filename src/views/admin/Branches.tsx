import React, { useState, useEffect } from 'react';
import branchService, { type Branch, type BranchCreate, type BranchUpdate } from '@/services/branchService';
import { useBranch } from '@/contexts/BranchContext';
import { BranchCard } from '@/components/admin/BranchCard';
import { BranchDialog } from '@/components/dialogs/BranchDialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, Building2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const Branches: React.FC = () => {
  const { branches, refreshBranches } = useBranch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreate = () => {
    setSelectedBranch(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsDialogOpen(true);
  };

  const handleDelete = (branch: Branch) => {
    setBranchToDelete(branch);
  };

  const confirmDelete = async () => {
    if (!branchToDelete) return;

    try {
      setIsLoading(true);
      await branchService.deleteBranch(branchToDelete.id);
      toast({
        title: 'Success',
        description: `Branch "${branchToDelete.name}" has been deactivated.`,
      });
      await refreshBranches();
      setBranchToDelete(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to delete branch',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: BranchCreate) => {
    try {
      setIsLoading(true);
      if (selectedBranch) {
        await branchService.updateBranch(selectedBranch.id, data as BranchUpdate);
        toast({
          title: 'Success',
          description: 'Branch updated successfully.',
        });
      } else {
        await branchService.createBranch(data);
        toast({
          title: 'Success',
          description: 'Branch created successfully.',
        });
      }
      await refreshBranches();
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to save branch',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Branch Management</h1>
          <p className="text-muted-foreground">Manage your bakery locations</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Branch
        </Button>
      </div>

      {/* Branch Grid */}
      {branches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No branches yet</h2>
          <p className="text-muted-foreground mb-4">Get started by creating your first branch location.</p>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Branch
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Branch Dialog */}
      <BranchDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        branch={selectedBranch}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!branchToDelete} onOpenChange={() => setBranchToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate the branch "{branchToDelete?.name}". You can reactivate it later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isLoading}>
              {isLoading ? 'Deactivating...' : 'Deactivate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Branches;
