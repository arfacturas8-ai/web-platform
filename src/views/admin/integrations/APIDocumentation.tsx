import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, Code, Copy, ExternalLink } from 'lucide-react';

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  example?: string;
}

const ENDPOINTS: Record<string, Endpoint[]> = {
  menu: [
    { method: 'GET', path: '/api/v1/menu', description: 'List all menu items' },
    { method: 'GET', path: '/api/v1/menu/:id', description: 'Get menu item by ID' },
    { method: 'POST', path: '/api/v1/menu', description: 'Create new menu item' },
    { method: 'PUT', path: '/api/v1/menu/:id', description: 'Update menu item' },
    { method: 'DELETE', path: '/api/v1/menu/:id', description: 'Delete menu item' },
  ],
  orders: [
    { method: 'GET', path: '/api/v1/orders', description: 'List all orders' },
    { method: 'GET', path: '/api/v1/orders/:id', description: 'Get order by ID' },
    { method: 'POST', path: '/api/v1/orders', description: 'Create new order' },
    { method: 'PUT', path: '/api/v1/orders/:id/status', description: 'Update order status' },
  ],
  reservations: [
    { method: 'GET', path: '/api/v1/reservations', description: 'List all reservations' },
    { method: 'POST', path: '/api/v1/reservations', description: 'Create reservation' },
    { method: 'PUT', path: '/api/v1/reservations/:id', description: 'Update reservation' },
    { method: 'DELETE', path: '/api/v1/reservations/:id', description: 'Cancel reservation' },
  ],
};

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-green-100 text-green-800',
  POST: 'bg-blue-100 text-blue-800',
  PUT: 'bg-yellow-100 text-yellow-800',
  DELETE: 'bg-red-100 text-red-800',
};

export default function APIDocumentation() {
  const [activeTab, setActiveTab] = useState('menu');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Documentation</h1>
          <p className="text-muted-foreground">Reference for the Baker's Bakery API</p>
        </div>
        <Button variant="outline">
          <ExternalLink className="h-4 w-4 mr-2" />
          Open in Swagger
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Base URL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 bg-muted rounded-md font-mono">
            <span>https://api.bakersbakery.com/api/v1</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy('https://api.bakersbakery.com/api/v1')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Endpoints
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="menu">Menu</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="reservations">Reservations</TabsTrigger>
            </TabsList>

            {Object.entries(ENDPOINTS).map(([category, endpoints]) => (
              <TabsContent key={category} value={category} className="space-y-4 mt-4">
                {endpoints.map((endpoint, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge className={METHOD_COLORS[endpoint.method]}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm font-mono">{endpoint.path}</code>
                    </div>
                    <span className="text-sm text-muted-foreground">{endpoint.description}</span>
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            All API requests require authentication using an API key. Include your API key in the
            request headers:
          </p>
          <div className="p-3 bg-muted rounded-md font-mono text-sm">
            <pre>{`Authorization: Bearer YOUR_API_KEY`}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
