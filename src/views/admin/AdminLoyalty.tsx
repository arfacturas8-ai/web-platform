import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Loader2,
  Settings,
  Award,
  Gift,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Users,
  TrendingUp,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoyaltyProgram {
  id: string;
  name: string;
  description?: string;
  points_per_dollar: number;
  minimum_purchase_amount: number;
  points_expire_days?: number;
  birthday_bonus_points: number;
  is_active: boolean;
}

interface Tier {
  id: string;
  name: string;
  level: string;
  min_points: number;
  color: string;
  description?: string;
  benefits?: Record<string, any>;
  is_active: boolean;
}

interface Reward {
  id: string;
  name: string;
  description?: string;
  points_required: number;
  reward_type: string;
  value?: number;
  is_active: boolean;
  total_redeemed: number;
}

interface Statistics {
  total_members: number;
  total_points_issued: number;
  total_points_redeemed: number;
  total_rewards_redeemed: number;
  active_members_30d: number;
  tier_distribution: Record<string, number>;
  top_rewards: Array<{ name: string; points_required: number; redemption_count: number }>;
}

export default function AdminLoyalty() {
  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState<LoyaltyProgram | null>(null);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [showRewardDialog, setShowRewardDialog] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const fetchLoyaltyData = async () => {
    setLoading(true);

    try {
      // Fetch program
      const programResponse = await fetch('/api/v1/loyalty/program');
      if (programResponse.ok) {
        const programData = await programResponse.json();
        setProgram(programData);
      }

      // Fetch tiers
      const tiersResponse = await fetch('/api/v1/loyalty/tiers');
      if (tiersResponse.ok) {
        const tiersData = await tiersResponse.json();
        setTiers(tiersData);
      }

      // Fetch rewards (admin endpoint)
      const rewardsResponse = await fetch('/api/v1/loyalty/admin/rewards', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (rewardsResponse.ok) {
        const rewardsData = await rewardsResponse.json();
        setRewards(rewardsData);
      }

      // Fetch statistics
      const statsResponse = await fetch('/api/v1/loyalty/admin/statistics', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStatistics(statsData);
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to load loyalty data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgram = async (updates: Partial<LoyaltyProgram>) => {
    if (!program) return;

    try {
      const response = await fetch(`/api/v1/loyalty/admin/programs/${program.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update program');

      const updatedProgram = await response.json();
      setProgram(updatedProgram);

      toast({
        title: 'Success',
        description: 'Loyalty program updated successfully',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const handleCreateReward = () => {
    setEditingReward(null);
    setShowRewardDialog(true);
  };

  const handleEditReward = (reward: Reward) => {
    setEditingReward(reward);
    setShowRewardDialog(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Loyalty Program Management</h1>
        <p className="text-muted-foreground">
          Configure and manage your loyalty program, tiers, and rewards
        </p>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{statistics.total_members}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Points Issued
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-2xl font-bold text-green-600">
                  {statistics.total_points_issued.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Points Redeemed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-purple-600" />
                <span className="text-2xl font-bold text-purple-600">
                  {statistics.total_points_redeemed.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active (30d)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">
                  {statistics.active_members_30d}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="program" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="program">
            <Settings className="mr-2 h-4 w-4" />
            Program
          </TabsTrigger>
          <TabsTrigger value="tiers">
            <Award className="mr-2 h-4 w-4" />
            Tiers
          </TabsTrigger>
          <TabsTrigger value="rewards">
            <Gift className="mr-2 h-4 w-4" />
            Rewards
          </TabsTrigger>
          <TabsTrigger value="statistics">
            <BarChart3 className="mr-2 h-4 w-4" />
            Statistics
          </TabsTrigger>
        </TabsList>

        {/* Program Settings Tab */}
        <TabsContent value="program">
          {program && (
            <Card>
              <CardHeader>
                <CardTitle>Program Settings</CardTitle>
                <CardDescription>
                  Configure the core settings of your loyalty program
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="program-name">Program Name</Label>
                    <Input
                      id="program-name"
                      value={program.name}
                      onChange={(e) =>
                        setProgram({ ...program, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="points-per-dollar">
                      Points per Dollar ($1 = X points)
                    </Label>
                    <Input
                      id="points-per-dollar"
                      type="number"
                      value={program.points_per_dollar}
                      onChange={(e) =>
                        setProgram({
                          ...program,
                          points_per_dollar: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="min-purchase">
                      Minimum Purchase Amount ($)
                    </Label>
                    <Input
                      id="min-purchase"
                      type="number"
                      step="0.01"
                      value={program.minimum_purchase_amount}
                      onChange={(e) =>
                        setProgram({
                          ...program,
                          minimum_purchase_amount: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expire-days">
                      Points Expire After (days)
                    </Label>
                    <Input
                      id="expire-days"
                      type="number"
                      value={program.points_expire_days || ''}
                      onChange={(e) =>
                        setProgram({
                          ...program,
                          points_expire_days: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        })
                      }
                      placeholder="Never expire"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthday-bonus">
                      Birthday Bonus Points
                    </Label>
                    <Input
                      id="birthday-bonus"
                      type="number"
                      value={program.birthday_bonus_points}
                      onChange={(e) =>
                        setProgram({
                          ...program,
                          birthday_bonus_points: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="program-active"
                      checked={program.is_active}
                      onCheckedChange={(checked) =>
                        setProgram({ ...program, is_active: checked })
                      }
                    />
                    <Label htmlFor="program-active">Program Active</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={program.description || ''}
                    onChange={(e) =>
                      setProgram({ ...program, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <Button onClick={() => handleUpdateProgram(program)}>
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tiers Tab */}
        <TabsContent value="tiers">
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Tiers</CardTitle>
              <CardDescription>
                Manage customer loyalty tiers and their benefits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: tier.color }}
                      >
                        {tier.name[0]}
                      </div>
                      <div>
                        <h4 className="font-semibold">{tier.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {tier.min_points.toLocaleString()} points minimum
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={tier.is_active ? 'default' : 'secondary'}>
                        {tier.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Rewards</CardTitle>
                  <CardDescription>
                    Manage available rewards for customers to redeem
                  </CardDescription>
                </div>
                <Button onClick={handleCreateReward}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Reward
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rewards.map((reward) => (
                  <div
                    key={reward.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-semibold">{reward.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {reward.points_required} points • {reward.reward_type}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Redeemed {reward.total_redeemed} times
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={reward.is_active ? 'default' : 'secondary'}>
                        {reward.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditReward(reward)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics">
          {statistics && (
            <div className="space-y-6">
              {/* Tier Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Tier Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(statistics.tier_distribution).map(
                      ([tier, count]) => (
                        <div key={tier} className="flex items-center justify-between">
                          <span className="font-medium">{tier || 'No Tier'}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{
                                  width: `${
                                    (count / statistics.total_members) * 100
                                  }%`,
                                }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-12 text-right">
                              {count}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Top Rewards */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Redeemed Rewards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {statistics.top_rewards.map((reward, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{reward.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {reward.points_required} points
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {reward.redemption_count} redemptions
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
