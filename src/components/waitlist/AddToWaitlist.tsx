import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WaitTimeBadge } from './WaitTimeBadge';
import { Clock, AlertCircle } from 'lucide-react';
import { useAddToWaitlist, useWaitlistEstimate } from '@/hooks/useWaitlist';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface AddToWaitlistProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddToWaitlist = ({ open, onClose, onSuccess }: AddToWaitlistProps) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    party_size: 2,
    special_requests: '',
    preferred_seating: '',
    is_vip: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: addToWaitlist, isPending: isLoading } = useAddToWaitlist();
  const { data: estimate, isLoading: estimateLoading } = useWaitlistEstimate(
    formData.party_size,
    formData.preferred_seating
  );

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData({
        customer_name: '',
        phone: '',
        email: '',
        party_size: 2,
        special_requests: '',
        preferred_seating: '',
        is_vip: false
      });
      setErrors({});
    }
  }, [open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (formData.party_size < 1 || formData.party_size > 20) {
      newErrors.party_size = 'Party size must be between 1 and 20';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    addToWaitlist(formData, {
      onSuccess: () => {
        onSuccess();
      },
      onError: (error: any) => {
        setErrors({ submit: error.message || 'Failed to add to waitlist' });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add to Waitlist</DialogTitle>
          <DialogDescription>
            Add a customer to the waiting list for a table
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Customer Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              placeholder="John Doe"
              className={errors.customer_name ? 'border-red-500' : ''}
            />
            {errors.customer_name && (
              <p className="text-sm text-red-500">{errors.customer_name}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(555) 123-4567"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Party Size */}
          <div className="space-y-2">
            <Label htmlFor="party-size">
              Party Size <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.party_size.toString()}
              onValueChange={(value) => setFormData({ ...formData, party_size: parseInt(value) })}
            >
              <SelectTrigger id="party-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size} {size === 1 ? 'person' : 'people'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Wait Time Estimate */}
          {estimate && !estimateLoading && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription className="flex items-center gap-2">
                Estimated wait time: <WaitTimeBadge minutes={estimate.estimated_wait_minutes} />
                <span className="text-sm text-gray-600">
                  ({estimate.parties_ahead} {estimate.parties_ahead === 1 ? 'party' : 'parties'} ahead)
                </span>
              </AlertDescription>
            </Alert>
          )}

          {/* Seating Preference */}
          <div className="space-y-2">
            <Label htmlFor="seating">Seating Preference (Optional)</Label>
            <Select
              value={formData.preferred_seating}
              onValueChange={(value) => setFormData({ ...formData, preferred_seating: value })}
            >
              <SelectTrigger id="seating">
                <SelectValue placeholder="No preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No preference</SelectItem>
                <SelectItem value="indoor">Indoor</SelectItem>
                <SelectItem value="outdoor">Outdoor</SelectItem>
                <SelectItem value="patio">Patio</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="special-requests">Special Requests (Optional)</Label>
            <Textarea
              id="special-requests"
              value={formData.special_requests}
              onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
              placeholder="Any special requirements..."
              rows={3}
            />
          </div>

          {/* VIP Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="vip" className="flex flex-col gap-1">
              <span>VIP Guest</span>
              <span className="text-xs text-gray-500 font-normal">
                Higher priority in the queue
              </span>
            </Label>
            <Switch
              id="vip"
              checked={formData.is_vip}
              onCheckedChange={(checked) => setFormData({ ...formData, is_vip: checked })}
            />
          </div>

          {/* Error Alert */}
          {errors.submit && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <LoadingSpinner text="Adding..." /> : 'Add to Waitlist'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
