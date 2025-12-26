import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Webhook, Plus, Trash2, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  is_active: boolean;
  last_triggered: string | null;
  last_status: 'success' | 'failed' | null;
}

const AVAILABLE_EVENTS = [
  { id: 'order.created', name: 'Order Created' },
  { id: 'order.updated', name: 'Order Updated' },
  { id: 'order.completed', name: 'Order Completed' },
  { id: 'reservation.created', name: 'Reservation Created' },
  { id: 'reservation.updated', name: 'Reservation Updated' },
  { id: 'customer.created', name: 'Customer Created' },
  { id: 'inventory.low', name: 'Low Inventory Alert' },
];

export default function Webhooks() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [] as string[],
  });

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = async () => {
    setIsLoading(true);
    // Mock data
    setTimeout(() => {
      setWebhooks([
        {
          id: '1',
          name: 'Order Notifications',
          url: 'https://api.example.com/webhooks/orders',
          events: ['order.created', 'order.completed'],
          is_active: true,
          last_triggered: new Date().toISOString(),
          last_status: 'success',
        },
      ]);
      setIsLoading(false);
    }, 500);
  };

  const handleCreateWebhook = () => {
    if (!newWebhook.name.trim() || !newWebhook.url.trim()) return;

    const webhook: WebhookConfig = {
      id: Math.random().toString(36).substring(7),
      name: newWebhook.name,
      url: newWebhook.url,
      events: newWebhook.events,
      is_active: true,
      last_triggered: null,
      last_status: null,
    };

    setWebhooks([...webhooks, webhook]);
    setNewWebhook({ name: '', url: '', events: [] });
    setIsCreateDialogOpen(false);
  };

  const handleToggleEvent = (eventId: string) => {
    setNewWebhook((prev) => ({
      ...prev,
      events: prev.events.includes(eventId)
        ? prev.events.filter((e) => e !== eventId)
        : [...prev.events, eventId],
    }));
  };

  const handleDeleteWebhook = (id: string) => {
    if (confirm('Are you sure you want to delete this webhook?')) {
      setWebhooks(webhooks.filter((w) => w.id !== id));
    }
  };

  const handleTestWebhook = async (webhook: WebhookConfig) => {
    alert(`Testing webhook: ${webhook.name}`);
    // In real implementation, would send a test request
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Webhooks</h1>
          <p className="text-muted-foreground">Configure webhook endpoints for real-time notifications</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Webhook</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  placeholder="e.g., Order Notifications"
                  value={newWebhook.name}
                  onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  placeholder="https://your-server.com/webhook"
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Events</Label>
                <div className="grid gap-2">
                  {AVAILABLE_EVENTS.map((event) => (
                    <div key={event.id} className="flex items-center gap-2">
                      <Checkbox
                        id={event.id}
                        checked={newWebhook.events.includes(event.id)}
                        onCheckedChange={() => handleToggleEvent(event.id)}
                      />
                      <label htmlFor={event.id} className="text-sm">
                        {event.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={handleCreateWebhook} className="w-full">
                Create Webhook
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-5 w-5" />
            Configured Webhooks
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : webhooks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No webhooks configured. Add one to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <div
                  key={webhook.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{webhook.name}</span>
                      <Badge variant={webhook.is_active ? 'default' : 'secondary'}>
                        {webhook.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      {webhook.last_status && (
                        <Badge
                          variant={webhook.last_status === 'success' ? 'default' : 'destructive'}
                          className="flex items-center gap-1"
                        >
                          {webhook.last_status === 'success' ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          {webhook.last_status}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground font-mono">{webhook.url}</div>
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleTestWebhook(webhook)}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteWebhook(webhook.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
