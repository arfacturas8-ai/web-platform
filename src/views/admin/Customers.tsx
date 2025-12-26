import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { EmptyState } from '@/components/common/EmptyState';
import { DataTable, Column } from '@/components/admin/DataTable';
import { useToast } from '@/components/ui/toast';
import { Users, Mail, Phone } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import type { CustomerWithNotes } from '@/types/reservation';
import { format } from 'date-fns';

export const Customers = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const { data: customers, isLoading, error, refetch } = useCustomers(search);

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading customers..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load customers"
        onRetry={() => refetch()}
      />
    );
  }

  const columns: Column<CustomerWithNotes>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (customer) => `${customer.first_name} ${customer.last_name}`,
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      render: (customer) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{customer.email}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (customer) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{customer.phone}</span>
        </div>
      ),
    },
    {
      key: 'reservation_count',
      header: 'Reservations',
      sortable: true,
      render: (customer) => (
        <Badge variant="outline">{customer.reservation_count || 0}</Badge>
      ),
    },
    {
      key: 'last_reservation_date',
      header: 'Last Visit',
      sortable: true,
      render: (customer) =>
        customer.last_reservation_date
          ? format(new Date(customer.last_reservation_date), 'MMM d, yyyy')
          : '-',
    },
    {
      key: 'created_at',
      header: 'Customer Since',
      sortable: true,
      render: (customer) => format(new Date(customer.created_at), 'MMM d, yyyy'),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">
            View and manage customer information
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          {customers && customers.length > 0 ? (
            <DataTable
              data={customers}
              columns={columns}
              searchable
              searchPlaceholder="Search customers by name, email, or phone..."
            />
          ) : (
            <EmptyState
              icon={Users}
              title="No customers yet"
              description="Customers will appear here once they make reservations"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
