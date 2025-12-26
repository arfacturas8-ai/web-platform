import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Search, SlidersHorizontal, Award } from 'lucide-react';
import { RewardCard } from '@/components/loyalty/RewardCard';
import { RedemptionDialog } from '@/components/loyalty/RedemptionDialog';
import { useToast } from '@/hooks/use-toast';

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

export default function RewardsMarketplace() {
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [filteredRewards, setFilteredRewards] = useState<Reward[]>([]);
  const [availablePoints, setAvailablePoints] = useState(0);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showRedemptionDialog, setShowRedemptionDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('points_asc');

  const { toast } = useToast();
  const customerId = 'demo-customer-id'; // In production, from auth context

  useEffect(() => {
    fetchRewards();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [rewards, searchQuery, filterType, sortBy]);

  const fetchRewards = async () => {
    setLoading(true);

    try {
      // Fetch balance
      const balanceResponse = await fetch(
        `/api/v1/loyalty/balance?customer_id=${customerId}`
      );
      if (!balanceResponse.ok) throw new Error('Failed to fetch balance');
      const balanceData = await balanceResponse.json();
      setAvailablePoints(balanceData.available_points);

      // Fetch rewards
      const rewardsResponse = await fetch(
        `/api/v1/loyalty/rewards?customer_id=${customerId}`
      );
      if (!rewardsResponse.ok) throw new Error('Failed to fetch rewards');
      const rewardsData = await rewardsResponse.json();
      setRewards(rewardsData);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to load rewards',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...rewards];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (reward) =>
          reward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          reward.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter((reward) => reward.reward_type === filterType);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'points_asc':
          return a.points_required - b.points_required;
        case 'points_desc':
          return b.points_required - a.points_required;
        case 'affordable':
          if (a.can_afford === b.can_afford) {
            return a.points_required - b.points_required;
          }
          return a.can_afford ? -1 : 1;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredRewards(filtered);
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
    await fetchRewards();
    return result;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const affordableCount = rewards.filter((r) => r.can_afford).length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Rewards Marketplace</h1>
        <p className="text-muted-foreground">
          Browse and redeem exclusive rewards with your points
        </p>
      </div>

      {/* Points Balance Card */}
      <Card className="mb-6 bg-gradient-to-br from-primary/10 to-background">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Your Points
            </span>
            <Badge variant="default" className="text-lg px-4 py-1">
              {availablePoints.toLocaleString()} pts
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You can afford <strong>{affordableCount}</strong> of{' '}
            <strong>{rewards.length}</strong> available rewards
          </p>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rewards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filter by Type */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="discount_percent">% Discount</SelectItem>
                <SelectItem value="discount_amount">$ Discount</SelectItem>
                <SelectItem value="free_item">Free Item</SelectItem>
                <SelectItem value="free_delivery">Free Delivery</SelectItem>
                <SelectItem value="upgrade">Upgrade</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="points_asc">Points: Low to High</SelectItem>
                <SelectItem value="points_desc">Points: High to Low</SelectItem>
                <SelectItem value="affordable">Affordable First</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredRewards.length} reward{filteredRewards.length !== 1 ? 's' : ''}
      </div>

      {/* Rewards Grid */}
      {filteredRewards.length === 0 ? (
        <Alert>
          <AlertDescription>
            No rewards found matching your criteria. Try adjusting your filters.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              onRedeem={handleRedeemReward}
              availablePoints={availablePoints}
            />
          ))}
        </div>
      )}

      {/* Redemption Dialog */}
      <RedemptionDialog
        open={showRedemptionDialog}
        onClose={() => {
          setShowRedemptionDialog(false);
          setSelectedReward(null);
        }}
        reward={selectedReward}
        availablePoints={availablePoints}
        onConfirm={handleConfirmRedemption}
      />
    </div>
  );
}
