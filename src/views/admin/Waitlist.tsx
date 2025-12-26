import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WaitlistEntry } from '@/components/waitlist/WaitlistEntry';
import { AddToWaitlist } from '@/components/waitlist/AddToWaitlist';
import { NotifyDialog } from '@/components/waitlist/NotifyDialog';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Users, Clock, Bell, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useWaitlist, useWaitlistSummary } from '@/hooks/useWaitlist';
import { WaitlistEntryType, WaitlistStatus } from '@/types/waitlist';

export const Waitlist = () => {
  const [selectedTab, setSelectedTab] = useState<WaitlistStatus>('waiting');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<WaitlistEntryType | null>(null);
  const [showNotifyDialog, setShowNotifyDialog] = useState(false);

  const { data: entries, isLoading, error, refetch } = useWaitlist(selectedTab);
  const { data: summary, refetch: refetchSummary } = useWaitlistSummary();

  // Refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
      refetchSummary();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch, refetchSummary]);

  const filteredEntries = entries?.filter(entry =>
    entry.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.phone.includes(searchQuery) ||
    entry.quote_number.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleNotify = (entry: WaitlistEntryType) => {
    setSelectedEntry(entry);
    setShowNotifyDialog(true);
  };

  const handleSeat = (entry: WaitlistEntryType) => {
    setSelectedEntry(entry);
    // Will open table selection in WaitlistEntry component
  };

  const getStatusIcon = (status: WaitlistStatus) => {
    const icons = {
      waiting: <Clock className="h-4 w-4" />,
      notified: <Bell className="h-4 w-4" />,
      seated: <CheckCircle className="h-4 w-4" />,
      cancelled: <XCircle className="h-4 w-4" />,
      no_show: <AlertCircle className="h-4 w-4" />
    };
    return icons[status] || <Clock className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Waitlist Management</h1>
          <p className="text-muted-foreground">Manage walk-in customers and table assignments</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} size="lg">
          <Users className="mr-2 h-4 w-4" />
          Add to Waitlist
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waiting</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.total_waiting || 0}</div>
            <p className="text-xs text-muted-foreground">
              Parties in queue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notified</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.total_notified || 0}</div>
            <p className="text-xs text-muted-foreground">
              Ready to be seated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.avg_wait_time ? `${Math.round(summary.avg_wait_time)}m` : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              Current average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Longest Wait</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.longest_wait_minutes ? `${summary.longest_wait_minutes}m` : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              Needs attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <Input
          placeholder="Search by name, phone, or quote number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Waitlist Tabs */}
      <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as WaitlistStatus)}>
        <TabsList>
          <TabsTrigger value="waiting">
            {getStatusIcon('waiting')}
            <span className="ml-2">Waiting</span>
          </TabsTrigger>
          <TabsTrigger value="notified">
            {getStatusIcon('notified')}
            <span className="ml-2">Notified</span>
          </TabsTrigger>
          <TabsTrigger value="seated">
            {getStatusIcon('seated')}
            <span className="ml-2">Seated</span>
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            {getStatusIcon('cancelled')}
            <span className="ml-2">Cancelled</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {isLoading ? (
            <LoadingSpinner text="Loading waitlist..." />
          ) : error ? (
            <ErrorMessage message="Failed to load waitlist" onRetry={() => refetch()} />
          ) : filteredEntries.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No entries found</p>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search' : 'Add customers to get started'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredEntries.map((entry) => (
                <WaitlistEntry
                  key={entry.id}
                  entry={entry}
                  onNotify={handleNotify}
                  onSeat={handleSeat}
                  onRefresh={refetch}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add to Waitlist Dialog */}
      <AddToWaitlist
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSuccess={() => {
          setShowAddDialog(false);
          refetch();
          refetchSummary();
        }}
      />

      {/* Notify Dialog */}
      {selectedEntry && (
        <NotifyDialog
          open={showNotifyDialog}
          onClose={() => {
            setShowNotifyDialog(false);
            setSelectedEntry(null);
          }}
          entry={selectedEntry}
          onSuccess={() => {
            setShowNotifyDialog(false);
            setSelectedEntry(null);
            refetch();
            refetchSummary();
          }}
        />
      )}
    </div>
  );
};

export default Waitlist;
