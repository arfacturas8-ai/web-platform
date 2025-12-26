import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Download, BarChart3, TrendingUp, Calendar } from 'lucide-react';

interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const reportTypes: ReportType[] = [
  {
    id: 'income',
    name: 'Income Statement',
    description: 'Revenue, expenses, and profit/loss summary',
    icon: <TrendingUp className="h-8 w-8" />,
  },
  {
    id: 'balance',
    name: 'Balance Sheet',
    description: 'Assets, liabilities, and equity snapshot',
    icon: <BarChart3 className="h-8 w-8" />,
  },
  {
    id: 'cashflow',
    name: 'Cash Flow',
    description: 'Cash inflows and outflows analysis',
    icon: <FileText className="h-8 w-8" />,
  },
  {
    id: 'sales',
    name: 'Sales Report',
    description: 'Daily, weekly, and monthly sales breakdown',
    icon: <BarChart3 className="h-8 w-8" />,
  },
];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    if (!selectedReport) return;

    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      alert(`Report "${reportTypes.find(r => r.id === selectedReport)?.name}" generated successfully!`);
    }, 2000);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-muted-foreground">Generate and download financial reports</p>
        </div>
      </div>

      {/* Report Selection */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reportTypes.map((report) => (
          <Card
            key={report.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedReport === report.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedReport(report.id)}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-3">
                <div className={`p-3 rounded-full ${
                  selectedReport === report.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  {report.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{report.name}</h3>
                  <p className="text-sm text-muted-foreground">{report.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Report Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Format</Label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              onClick={handleGenerateReport}
              disabled={!selectedReport || isGenerating}
            >
              {isGenerating ? (
                'Generating...'
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No recent reports generated. Select a report type above to get started.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
