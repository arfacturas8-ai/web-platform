/**
 * Cafe 1973 | Bakery - Admin Layout
 * Main layout wrapper for admin panel
 */
import React from 'react';
import { Navigate } from '@/lib/router';
import { useAuth } from '@/hooks/useAuth';
import { BranchProvider } from '@/contexts/BranchContext';
import { Sidebar } from './Sidebar';
import { AdminNavbar } from './AdminNavbar';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sand border-t-forest rounded-full animate-spin mx-auto mb-4" />
          <p className="text-forest/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Store the intended destination for after login
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
    }
    // Redirect to home - don't expose admin login to public
    return <Navigate to="/" replace />;
  }

  return (
    <BranchProvider>
      <div className="flex min-h-screen bg-[#faf8f3]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminNavbar />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </BranchProvider>
  );
};
