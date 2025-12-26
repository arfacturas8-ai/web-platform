import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, Phone, Mail, Send, AlertCircle } from 'lucide-react';
import { WaitlistEntryType } from '@/types/waitlist';
import { useNotifyCustomer } from '@/hooks/useWaitlist';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface NotifyDialogProps {
  open: boolean;
  onClose: () => void;
  entry: WaitlistEntryType;
  onSuccess: () => void;
}

export const NotifyDialog = ({ open, onClose, entry, onSuccess }: NotifyDialogProps) => {
  const [notificationType, setNotificationType] = useState<'sms' | 'whatsapp' | 'call' | 'email'>('sms');
  const [customMessage, setCustomMessage] = useState('');
  const [error, setError] = useState('');

  const { mutate: notifyCustomer, isPending: isLoading } = useNotifyCustomer();

  const defaultMessage = `Hello ${entry.customer_name}! Your table for ${entry.party_size} is ready. Please proceed to the host stand. Quote: ${entry.quote_number}`;

  const handleNotify = () => {
    setError('');

    notifyCustomer(
      {
        entry_id: entry.id,
        notification_type: notificationType,
        custom_message: customMessage || undefined
      },
      {
        onSuccess: () => {
          onSuccess();
        },
        onError: (error: any) => {
          setError(error.message || 'Failed to send notification');
        }
      }
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'sms':
        return <MessageSquare className="h-5 w-5" />;
      case 'whatsapp':
        return <MessageSquare className="h-5 w-5 text-green-600" />;
      case 'call':
        return <Phone className="h-5 w-5" />;
      case 'email':
        return <Mail className="h-5 w-5" />;
      default:
        return <Send className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Notify Customer</DialogTitle>
          <DialogDescription>
            Send a notification to {entry.customer_name} that their table is ready
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Customer Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Quote:</span>
              <span className="font-semibold">{entry.quote_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Party Size:</span>
              <span className="font-semibold">{entry.party_size} people</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Phone:</span>
              <span className="font-semibold">{entry.phone}</span>
            </div>
            {entry.email && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Email:</span>
                <span className="font-semibold text-sm">{entry.email}</span>
              </div>
            )}
          </div>

          {/* Notification Type */}
          <div className="space-y-3">
            <Label>Notification Method</Label>
            <RadioGroup value={notificationType} onValueChange={(value: any) => setNotificationType(value)}>
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                <RadioGroupItem value="sms" id="sms" />
                <Label htmlFor="sms" className="flex items-center gap-2 flex-1 cursor-pointer">
                  {getNotificationIcon('sms')}
                  <div>
                    <div className="font-medium">SMS Text Message</div>
                    <div className="text-xs text-gray-500">Send via SMS to {entry.phone}</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                <RadioGroupItem value="whatsapp" id="whatsapp" />
                <Label htmlFor="whatsapp" className="flex items-center gap-2 flex-1 cursor-pointer">
                  {getNotificationIcon('whatsapp')}
                  <div>
                    <div className="font-medium">WhatsApp</div>
                    <div className="text-xs text-gray-500">Send via WhatsApp to {entry.phone}</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                <RadioGroupItem value="call" id="call" />
                <Label htmlFor="call" className="flex items-center gap-2 flex-1 cursor-pointer">
                  {getNotificationIcon('call')}
                  <div>
                    <div className="font-medium">Phone Call</div>
                    <div className="text-xs text-gray-500">Call {entry.phone}</div>
                  </div>
                </Label>
              </div>

              {entry.email && (
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                  <RadioGroupItem value="email" id="email" />
                  <Label htmlFor="email" className="flex items-center gap-2 flex-1 cursor-pointer">
                    {getNotificationIcon('email')}
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-xs text-gray-500">Send to {entry.email}</div>
                    </div>
                  </Label>
                </div>
              )}
            </RadioGroup>
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Custom Message (Optional)</Label>
            <Textarea
              id="message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder={defaultMessage}
              rows={4}
            />
            <p className="text-xs text-gray-500">
              Leave blank to use the default message
            </p>
          </div>

          {/* Preview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700 font-semibold mb-1">Message Preview:</p>
            <p className="text-sm text-gray-700">{customMessage || defaultMessage}</p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleNotify} disabled={isLoading}>
            {isLoading ? (
              <LoadingSpinner text="Sending..." />
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Notification
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
