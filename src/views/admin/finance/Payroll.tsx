import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DollarSign, Users, Calendar, Download, Calculator } from 'lucide-react';

interface PayrollEntry {
  id: string;
  employee_name: string;
  position: string;
  hours_worked: number;
  hourly_rate: number;
  gross_pay: number;
  deductions: number;
  net_pay: number;
  status: 'pending' | 'processed' | 'paid';
  pay_period: string;
}

export default function Payroll() {
  const [payrollData, setPayrollData] = useState<PayrollEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  useEffect(() => {
    loadPayrollData();
  }, [selectedPeriod]);

  const loadPayrollData = async () => {
    setIsLoading(true);
    // Mock data for now
    setTimeout(() => {
      setPayrollData([
        {
          id: '1',
          employee_name: 'Juan Perez',
          position: 'Baker',
          hours_worked: 160,
          hourly_rate: 15,
          gross_pay: 2400,
          deductions: 360,
          net_pay: 2040,
          status: 'pending',
          pay_period: '2024-01',
        },
        {
          id: '2',
          employee_name: 'Maria Garcia',
          position: 'Cashier',
          hours_worked: 120,
          hourly_rate: 12,
          gross_pay: 1440,
          deductions: 216,
          net_pay: 1224,
          status: 'processed',
          pay_period: '2024-01',
        },
      ]);
      setIsLoading(false);
    }, 500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'processed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const totalGross = payrollData.reduce((sum, entry) => sum + entry.gross_pay, 0);
  const totalNet = payrollData.reduce((sum, entry) => sum + entry.net_pay, 0);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll Management</h1>
          <p className="text-muted-foreground">Manage employee compensation and payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Calculator className="h-4 w-4 mr-2" />
            Run Payroll
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payrollData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gross Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalGross.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Net Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalNet.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pay Period</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Period</SelectItem>
                <SelectItem value="previous">Previous Period</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Employee</th>
                    <th className="text-left py-3 px-4">Position</th>
                    <th className="text-right py-3 px-4">Hours</th>
                    <th className="text-right py-3 px-4">Rate</th>
                    <th className="text-right py-3 px-4">Gross</th>
                    <th className="text-right py-3 px-4">Deductions</th>
                    <th className="text-right py-3 px-4">Net</th>
                    <th className="text-center py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payrollData.map((entry) => (
                    <tr key={entry.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{entry.employee_name}</td>
                      <td className="py-3 px-4">{entry.position}</td>
                      <td className="py-3 px-4 text-right">{entry.hours_worked}</td>
                      <td className="py-3 px-4 text-right">${entry.hourly_rate}</td>
                      <td className="py-3 px-4 text-right">${entry.gross_pay.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">${entry.deductions.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-medium">${entry.net_pay.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge className={getStatusColor(entry.status)}>
                          {entry.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
