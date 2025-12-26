import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, Database, FileText, Calendar } from 'lucide-react';

const DATA_TYPES = [
  { id: 'orders', name: 'Orders', description: 'All order history and details' },
  { id: 'customers', name: 'Customers', description: 'Customer profiles and contact info' },
  { id: 'products', name: 'Products', description: 'Menu items and inventory' },
  { id: 'reservations', name: 'Reservations', description: 'Reservation history' },
  { id: 'analytics', name: 'Analytics', description: 'Sales and performance data' },
];

export default function DataExport() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [format, setFormat] = useState('csv');
  const [isExporting, setIsExporting] = useState(false);

  const handleToggleType = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId]
    );
  };

  const handleExport = async () => {
    if (selectedTypes.length === 0) {
      alert('Please select at least one data type to export');
      return;
    }

    setIsExporting(true);
    // Simulate export
    setTimeout(() => {
      setIsExporting(false);
      alert('Export completed! Your file will download shortly.');
    }, 2000);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Export</h1>
          <p className="text-muted-foreground">Export your bakery data in various formats</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Select Data to Export
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DATA_TYPES.map((type) => (
                <div key={type.id} className="flex items-start gap-3">
                  <Checkbox
                    id={type.id}
                    checked={selectedTypes.includes(type.id)}
                    onCheckedChange={() => handleToggleType(type.id)}
                  />
                  <div>
                    <label htmlFor={type.id} className="font-medium cursor-pointer">
                      {type.name}
                    </label>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Export Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button
                className="w-full"
                onClick={handleExport}
                disabled={selectedTypes.length === 0 || isExporting}
              >
                {isExporting ? (
                  'Exporting...'
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export Selected Data
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Export History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No previous exports. Your export history will appear here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
