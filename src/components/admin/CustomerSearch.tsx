import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useCustomerSearch } from '@/hooks/useCustomers';
import type { Customer } from '@/types/reservation';

interface CustomerSearchProps {
  onSelect: (customer: Customer) => void;
  placeholder?: string;
}

export const CustomerSearch = ({
  onSelect,
  placeholder = 'Search customers...',
}: CustomerSearchProps) => {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { data: customers, isLoading } = useCustomerSearch(query);

  useEffect(() => {
    setShowResults(query.length > 2);
  }, [query]);

  const handleSelect = (customer: Customer) => {
    onSelect(customer);
    setQuery(`${customer.first_name} ${customer.last_name}`);
    setShowResults(false);
  };

  return (
    <div className="relative">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        onFocus={() => query.length > 2 && setShowResults(true)}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
      />

      {showResults && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover shadow-md">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Spinner className="h-4 w-4" />
            </div>
          ) : customers && customers.length > 0 ? (
            <div className="p-1">
              {customers.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => handleSelect(customer)}
                  className="cursor-pointer rounded px-3 py-2 hover:bg-accent"
                >
                  <div className="font-medium">
                    {customer.first_name} {customer.last_name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {customer.email} • {customer.phone}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No customers found
            </div>
          )}
        </div>
      )}
    </div>
  );
};
