import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { logger } from '@/utils/logger';
import branchService, { type Branch } from '@/services/branchService';
import { useAuth } from './AuthContext';

interface BranchContextType {
  branches: Branch[];
  selectedBranch: Branch | null;
  isLoading: boolean;
  isAllBranches: boolean;
  setSelectedBranch: (branch: Branch | null) => void;
  setIsAllBranches: (isAll: boolean) => void;
  refreshBranches: () => Promise<void>;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

const STORAGE_KEY = 'selectedBranch';
const ALL_BRANCHES_KEY = 'allBranches';

export const BranchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranchState] = useState<Branch | null>(null);
  const [isAllBranches, setIsAllBranchesState] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Load branches and selected branch from localStorage on mount
  useEffect(() => {
    const loadBranches = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const fetchedBranches = await branchService.getBranches(true);
        setBranches(fetchedBranches);

        // Check if "all branches" mode is enabled
        const storedAllBranches = localStorage.getItem(ALL_BRANCHES_KEY);
        if (storedAllBranches === 'true') {
          setIsAllBranchesState(true);
          setSelectedBranchState(null);
        } else {
          // Load selected branch from localStorage
          const storedBranchId = localStorage.getItem(STORAGE_KEY);
          if (storedBranchId) {
            const branch = fetchedBranches.find((b) => b.id === storedBranchId);
            if (branch) {
              setSelectedBranchState(branch);
            } else if (fetchedBranches.length > 0) {
              // If stored branch not found, select the first one
              setSelectedBranchState(fetchedBranches[0]);
              localStorage.setItem(STORAGE_KEY, fetchedBranches[0].id);
            }
          } else if (fetchedBranches.length > 0) {
            // No stored branch, select the first one
            setSelectedBranchState(fetchedBranches[0]);
            localStorage.setItem(STORAGE_KEY, fetchedBranches[0].id);
          }
        }
      } catch (error) {
        logger.error('Failed to load branches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBranches();
  }, [isAuthenticated]);

  const setSelectedBranch = (branch: Branch | null) => {
    setSelectedBranchState(branch);
    if (branch) {
      localStorage.setItem(STORAGE_KEY, branch.id);
      localStorage.setItem(ALL_BRANCHES_KEY, 'false');
      setIsAllBranchesState(false);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const setIsAllBranches = (isAll: boolean) => {
    setIsAllBranchesState(isAll);
    if (isAll) {
      setSelectedBranchState(null);
      localStorage.setItem(ALL_BRANCHES_KEY, 'true');
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(ALL_BRANCHES_KEY, 'false');
      // Select first branch if available
      if (branches.length > 0) {
        setSelectedBranch(branches[0]);
      }
    }
  };

  const refreshBranches = async () => {
    try {
      const fetchedBranches = await branchService.getBranches(true);
      setBranches(fetchedBranches);

      // Update selected branch if it still exists
      if (selectedBranch) {
        const updatedBranch = fetchedBranches.find((b) => b.id === selectedBranch.id);
        if (updatedBranch) {
          setSelectedBranchState(updatedBranch);
        } else if (fetchedBranches.length > 0) {
          setSelectedBranch(fetchedBranches[0]);
        }
      }
    } catch (error) {
      logger.error('Failed to refresh branches:', error);
    }
  };

  return (
    <BranchContext.Provider
      value={{
        branches,
        selectedBranch,
        isLoading,
        isAllBranches,
        setSelectedBranch,
        setIsAllBranches,
        refreshBranches,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => {
  const context = useContext(BranchContext);
  if (context === undefined) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  return context;
};
