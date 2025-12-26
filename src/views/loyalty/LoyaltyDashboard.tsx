import { useState, useEffect } from 'react';
import { useNavigate } from '@/lib/router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Award, Gift, History, TrendingUp, Info } from 'lucide-react';
import { PointsBalance } from '@/components/loyalty/PointsBalance';
import { RewardCard } from '@/components/loyalty/RewardCard';
import { TierProgress } from '@/components/loyalty/TierProgress';
import { RedemptionDialog } from '@/components/loyalty/RedemptionDialog';
import { useToast } from '@/hooks/use-toast';

interface PointsBalance {
  customer_id: string;
  total_points: number;
  available_points: number;
  lifetime_earned: number;
  lifetime_redeemed: number;
  current_tier?: any;
  next_tier?: any;
  total_transactions: number;
  last_earned_at?: string;
  last_redeemed_at?: string;
}

interface Reward {
  id: string;
  name: string;
  description?: string;
  points_required: number;
  reward_type: string;
  value?: number;
  image_url?: string;
  terms?: string;
  can_afford: boolean;
  points_short: number;
  menu_item?: any;
}

interface Tier {
  id: string;
  name: string;
  level: string;
  min_points: number;
  color: string;
  icon?: string;
  description?: string;
  benefits?: any;
  is_active: boolean;
  display_order: number;
}

export default function LoyaltyDashboard() {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<PointsBalance | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showRedemptionDialog, setShowRedemptionDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  // For demo purposes, using a hardcoded customer ID
  // In production, this would come from authentication context
  const customerId = 'demo-customer-id';

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const fetchLoyaltyData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch points balance
      const balanceResponse = await fetch(
        `/api/v1/loyalty/balance?customer_id=${customerId}`
      );
      if (!balanceResponse.ok) throw new Error('Failed to fetch balance');
      const balanceData = await balanceResponse.json();
      setBalance(balanceData);

      // Fetch available rewards
      const rewardsResponse = await fetch(
        `/api/v1/loyalty/rewards?customer_id=${customerId}`
      );
      if (!rewardsResponse.ok) throw new Error('Failed to fetch rewards');
      const rewardsData = await rewardsResponse.json();
      setRewards(rewardsData);

      // Fetch tiers
      const tiersResponse = await fetch('/api/v1/loyalty/tiers');
      if (!tiersResponse.ok) throw new Error('Failed to fetch tiers');
      const tiersData = await tiersResponse.json();
      setTiers(tiersData);
    } catch (err: any) {
      setError(err.message || 'Failed to load loyalty data');
      toast({
        title: 'Error',
        description: err.message || 'Failed to load loyalty data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemReward = (reward: Reward) => {
    setSelectedReward(reward);
    setShowRedemptionDialog(true);
  };

  const handleConfirmRedemption = async (rewardId: string) => {
    const response = await fetch(
      `/api/v1/loyalty/redeem?customer_id=${customerId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reward_id: rewardId }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to redeem reward');
    }

    const result = await response.json();

    // Refresh loyalty data
    await fetchLoyaltyData();

    return result;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchLoyaltyData} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (!balance) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            No loyalty data found. Make a purchase to start earning points!
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Loyalty Rewards</h1>
        <p className="text-muted-foreground">
          Earn points with every purchase and redeem for exclusive rewards
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Points Balance - Spans 2 columns on large screens */}
        <div className="lg:col-span-2">
          <PointsBalance
            availablePoints={balance.available_points}
            lifetimeEarned={balance.lifetime_earned}
            lifetimeRedeemed={balance.lifetime_redeemed}
            currentTier={balance.current_tier}
            nextTier={balance.next_tier}
          />
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Button
            className="w-full"
            size="lg"
            onClick={() => navigate('/loyalty/rewards')}
          >
            <Gift className="mr-2 h-5 w-5" />
            Browse Rewards
          </Button>
          <Button
            className="w-full"
            variant="outline"
            size="lg"
            onClick={() => navigate('/loyalty/history')}
          >
            <History className="mr-2 h-5 w-5" />
            View History
          </Button>
          <Button
            className="w-full"
            variant="outline"
            size="lg"
            onClick={() => navigate('/menu')}
          >
            <TrendingUp className="mr-2 h-5 w-5" />
            Earn More Points
          </Button>
        </div>
      </div>

      {/* Tabs for Tiers and Featured Rewards */}
      <Tabs defaultValue="featured" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="featured">
            <Gift className="mr-2 h-4 w-4" />
            Featured Rewards
          </TabsTrigger>
          <TabsTrigger value="tiers">
            <Award className="mr-2 h-4 w-4" />
            Loyalty Tiers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Featured Rewards</h2>
            {rewards.length === 0 ? (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  No rewards available at the moment. Check back soon!
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards.slice(0, 6).map((reward) => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    onRedeem={handleRedeemReward}
                    availablePoints={balance.available_points}
                  />
                ))}
              </div>
            )}
            {rewards.length > 6 && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => navigate('/loyalty/rewards')}
                >
                  View All Rewards ({rewards.length})
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tiers">
          <TierProgress
            tiers={tiers}
            currentTier={balance.current_tier}
            lifetimeEarned={balance.lifetime_earned}
          />
        </TabsContent>
      </Tabs>

      {/* Redemption Dialog */}
      <RedemptionDialog
        open={showRedemptionDialog}
        onClose={() => {
          setShowRedemptionDialog(false);
          setSelectedReward(null);
        }}
        reward={selectedReward}
        availablePoints={balance.available_points}
        onConfirm={handleConfirmRedemption}
      />
    </div>
  );
}
