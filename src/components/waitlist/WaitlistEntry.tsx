import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WaitTimeBadge } from './WaitTimeBadge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Clock, Phone, Mail, MoreVertical, Bell, CheckCircle, XCircle, Edit, MapPin } from 'lucide-react';
import { WaitlistEntryType } from '@/types/waitlist';
import { useSeatParty, useCancelWaitlist, useTables } from '@/hooks/useWaitlist';
import { format } from 'date-fns';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface WaitlistEntryProps {
  entry: WaitlistEntryType;
  onNotify: (entry: WaitlistEntryType) => void;
  onSeat: (entry: WaitlistEntryType) => void;
  onRefresh: () => void;
}

export const WaitlistEntry = ({ entry, onNotify, onSeat, onRefresh }: WaitlistEntryProps) => {
  const [showSeatDialog, setShowSeatDialog] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState('');

  const { data: tables } = useTables();
  const { mutate: seatParty, isPending: seating } = useSeatParty();
  const { mutate: cancelEntry, isPending: cancelling } = useCancelWaitlist();

  const waitTime = entry.join_time
    ? Math.floor((new Date().getTime() - new Date(entry.join_time).getTime()) / 60000)
    : 0;

  const availableTables = tables?.filter(
    t => t.capacity >= entry.party_size && t.is_active
  ) || [];

  const handleSeat = () => {
    if (selectedTableId) {
      seatParty(
        { entry_id: entry.id, table_id: selectedTableId },
        {
          onSuccess: () => {
            setShowSeatDialog(false);
            onRefresh();
          }
        }
      );
    }
  };

  const handleCancel = () => {
    if (confirm(`Cancel waitlist entry for ${entry.customer_name}?`)) {
      cancelEntry(entry.id, {
        onSuccess: () => onRefresh()
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      waiting: 'bg-blue-100 text-blue-800',
      notified: 'bg-green-100 text-green-800',
      seated: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-orange-100 text-orange-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100';
  };

  return (
    <>
      <Card className={`hover:shadow-lg transition-shadow ${entry.is_vip ? 'border-yellow-400 border-2' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-blue-700">{entry.quote_number}</div>
              {entry.is_vip && (
                <Badge variant="default" className="bg-yellow-500">VIP</Badge>
              )}
              <Badge className={getStatusColor(entry.status)}>
                {entry.status}
              </Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {entry.status === 'waiting' && (
                  <>
                    <DropdownMenuItem onClick={() => onNotify(entry)}>
                      <Bell className="mr-2 h-4 w-4" />
                      Notify Customer
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowSeatDialog(true)}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Seat Party
                    </DropdownMenuItem>
                  </>
                )}
                {entry.status === 'notified' && (
                  <DropdownMenuItem onClick={() => setShowSeatDialog(true)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Seat Party
                  </DropdownMenuItem>
                )}
                {['waiting', 'notified'].includes(entry.status) && (
                  <DropdownMenuItem onClick={handleCancel} className="text-red-600">
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Entry
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Users className="h-4 w-4 text-gray-500" />
              {entry.customer_name}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-3 w-3" />
              {entry.phone}
            </div>

            {entry.email && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-3 w-3" />
                {entry.email}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t">
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Party Size</p>
              <p className="text-sm font-medium">{entry.party_size} people</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Wait Time</p>
              <p className="text-sm font-medium">{waitTime} min</p>
            </div>

            {entry.estimated_wait && (
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Estimated</p>
                <WaitTimeBadge minutes={entry.estimated_wait} />
              </div>
            )}

            {entry.preferred_seating && (
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Preference</p>
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="h-3 w-3" />
                  <span className="capitalize">{entry.preferred_seating}</span>
                </div>
              </div>
            )}
          </div>

          {entry.special_requests && (
            <div className="pt-2 border-t">
              <p className="text-xs text-gray-500 mb-1">Special Requests</p>
              <p className="text-sm">{entry.special_requests}</p>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            Joined {format(new Date(entry.join_time), 'h:mm a')}
          </div>
        </CardContent>

        {entry.status === 'waiting' && (
          <CardFooter className="gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onNotify(entry)}
            >
              <Bell className="mr-2 h-4 w-4" />
              Notify
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={() => setShowSeatDialog(true)}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Seat
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Seat Dialog */}
      <Dialog open={showSeatDialog} onOpenChange={setShowSeatDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Seat Party</DialogTitle>
            <DialogDescription>
              Select a table for {entry.customer_name} (party of {entry.party_size})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Select value={selectedTableId} onValueChange={setSelectedTableId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a table" />
              </SelectTrigger>
              <SelectContent>
                {availableTables.map((table) => (
                  <SelectItem key={table.id} value={table.id}>
                    Table {table.table_number} (Capacity: {table.capacity}) - {table.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {availableTables.length === 0 && (
              <p className="text-sm text-amber-600">
                No available tables with capacity for {entry.party_size} people
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSeatDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSeat}
              disabled={!selectedTableId || seating}
            >
              {seating ? <LoadingSpinner text="Seating..." /> : 'Confirm Seating'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
