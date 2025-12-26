import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Clock, TrendingUp, TrendingDown, Target, Award } from 'lucide-react';
import { useWaitlistAnalytics, useWaitlistTurnover } from '@/hooks/useWaitlist';
import { addDays, format } from 'date-fns';

export const WaitlistAnalytics = () => {
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -7),
    to: new Date()
  });

  const { data: analytics, isLoading, error, refetch } = useWaitlistAnalytics(
    dateRange.from,
    dateRange.to
  );

  const { data: turnover } = useWaitlistTurnover(dateRange.from, dateRange.to);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading analytics..." />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load analytics" onRetry={() => refetch()} />;
  }

  // Prepare chart data
  const waitTimeData = analytics?.map(a => ({
    date: format(new Date(a.date), 'MMM dd'),
    avg: a.avg_wait_time,
    min: a.min_wait_time,
    max: a.max_wait_time
  })) || [];

  const volumeData = analytics?.map(a => ({
    date: format(new Date(a.date), 'MMM dd'),
    total: a.total_entries,
    seated: a.total_seated,
    cancelled: a.total_cancelled,
    noShows: a.total_no_shows
  })) || [];

  const partySizeData = analytics?.[0]?.party_size_distribution
    ? Object.entries(analytics[0].party_size_distribution).map(([size, count]) => ({
        name: `${size} people`,
        value: count as number
      }))
    : [];

  const accuracyData = analytics?.map(a => ({
    date: format(new Date(a.date), 'MMM dd'),
    accuracy: a.avg_estimate_accuracy
  })) || [];

  const totalEntries = analytics?.reduce((sum, a) => sum + a.total_entries, 0) || 0;
  const totalSeated = analytics?.reduce((sum, a) => sum + a.total_seated, 0) || 0;
  const totalCancelled = analytics?.reduce((sum, a) => sum + a.total_cancelled, 0) || 0;
  const totalNoShows = analytics?.reduce((sum, a) => sum + a.total_no_shows, 0) || 0;

  const avgWaitTime = (analytics?.reduce((sum, a) => sum + (a.avg_wait_time || 0), 0) || 0) / (analytics?.length || 1);
  const avgAccuracy = (analytics?.reduce((sum, a) => sum + (a.avg_estimate_accuracy || 0), 0) || 0) / (analytics?.length || 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Waitlist Analytics</h1>
          <p className="text-muted-foreground">Performance metrics and insights</p>
        </div>
        <DatePickerWithRange
          date={dateRange}
          onDateChange={(range: { from: Date | undefined; to: Date | undefined }) => range && setDateRange(range as { from: Date; to: Date })}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEntries}</div>
            <p className="text-xs text-muted-foreground">
              {totalSeated} seated ({Math.round((totalSeated / totalEntries) * 100)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgWaitTime)}m</div>
            <p className="text-xs text-muted-foreground">
              Across all parties
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimate Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgAccuracy)}%</div>
            <p className="text-xs text-muted-foreground">
              {avgAccuracy >= 80 ? (
                <span className="text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Excellent
                </span>
              ) : (
                <span className="text-yellow-600 flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" /> Needs improvement
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No-Show Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((totalNoShows / totalEntries) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {totalNoShows} no-shows
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="wait-times" className="space-y-4">
        <TabsList>
          <TabsTrigger value="wait-times">Wait Times</TabsTrigger>
          <TabsTrigger value="volume">Volume</TabsTrigger>
          <TabsTrigger value="party-size">Party Size</TabsTrigger>
          <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
          <TabsTrigger value="turnover">Turnover</TabsTrigger>
        </TabsList>

        <TabsContent value="wait-times" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Wait Time Trends</CardTitle>
              <CardDescription>Average, minimum, and maximum wait times</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={waitTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avg" stroke="#8884d8" name="Average" strokeWidth={2} />
                  <Line type="monotone" dataKey="min" stroke="#82ca9d" name="Minimum" strokeWidth={2} />
                  <Line type="monotone" dataKey="max" stroke="#ff7300" name="Maximum" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volume" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Volume</CardTitle>
              <CardDescription>Waitlist entries by outcome</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="seated" stackId="a" fill="#82ca9d" name="Seated" />
                  <Bar dataKey="cancelled" stackId="a" fill="#ffc658" name="Cancelled" />
                  <Bar dataKey="noShows" stackId="a" fill="#ff7300" name="No Shows" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="party-size" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Party Size Distribution</CardTitle>
              <CardDescription>Breakdown by party size</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={partySizeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {partySizeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accuracy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estimate Accuracy</CardTitle>
              <CardDescription>How accurate are our wait time predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={accuracyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} label={{ value: 'Accuracy %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="accuracy" stroke="#82ca9d" name="Accuracy %" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="turnover" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Table Turnover</CardTitle>
              <CardDescription>Average time per party</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Parties</p>
                  <p className="text-2xl font-bold">{turnover?.total_parties || 0}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Avg Turnover Time</p>
                  <p className="text-2xl font-bold">{turnover?.avg_turnover_minutes || 0}m</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Covers</p>
                  <p className="text-2xl font-bold">{turnover?.total_covers || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WaitlistAnalytics;
