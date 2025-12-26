import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Key, Plus, Copy, Trash2, Eye, EyeOff, RefreshCw } from 'lucide-react';

interface APIKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used: string | null;
  is_active: boolean;
}

export default function APIKeys() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  useEffect(() => {
    loadAPIKeys();
  }, []);

  const loadAPIKeys = async () => {
    setIsLoading(true);
    // Mock data
    setTimeout(() => {
      setApiKeys([
        {
          id: '1',
          name: 'Production API',
          key: 'bk_live_xxxxxxxxxxxxxxxxxxxx',
          created_at: new Date().toISOString(),
          last_used: new Date().toISOString(),
          is_active: true,
        },
        {
          id: '2',
          name: 'Development API',
          key: 'bk_test_xxxxxxxxxxxxxxxxxxxx',
          created_at: new Date().toISOString(),
          last_used: null,
          is_active: true,
        },
      ]);
      setIsLoading(false);
    }, 500);
  };

  const handleCreateKey = () => {
    if (!newKeyName.trim()) return;

    const newKey: APIKey = {
      id: Math.random().toString(36).substring(7),
      name: newKeyName,
      key: `bk_${Math.random().toString(36).substring(2, 15)}`,
      created_at: new Date().toISOString(),
      last_used: null,
      is_active: true,
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName('');
    setIsCreateDialogOpen(false);
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    alert('API key copied to clipboard!');
  };

  const handleDeleteKey = (id: string) => {
    if (confirm('Are you sure you want to delete this API key?')) {
      setApiKeys(apiKeys.filter((k) => k.id !== id));
    }
  };

  const maskKey = (key: string) => {
    return key.substring(0, 7) + '••••••••••••••••';
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground">Manage your API access credentials</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Key Name</Label>
                <Input
                  placeholder="e.g., Production API"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateKey} className="w-full">
                Create Key
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Your API Keys
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No API keys yet. Create one to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{apiKey.name}</span>
                      <Badge variant={apiKey.is_active ? 'default' : 'secondary'}>
                        {apiKey.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
                      {showKey === apiKey.id ? apiKey.key : maskKey(apiKey.key)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                      >
                        {showKey === apiKey.id ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(apiKey.created_at).toLocaleDateString()}
                      {apiKey.last_used && (
                        <> | Last used: {new Date(apiKey.last_used).toLocaleDateString()}</>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleCopyKey(apiKey.key)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteKey(apiKey.id)}>
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
