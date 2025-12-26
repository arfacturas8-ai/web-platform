import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gift, Lock, Sparkles } from 'lucide-react';
import { getImageUrl } from '@/utils/constants';

interface Reward {
  id: string;
  name: string;
  description?: string;
  points_required: number;
  reward_type: string;
  value?: number;
  image_url?: string;
  can_afford: boolean;
  points_short: number;
  menu_item?: {
    id: string;
    name_en: string;
    name_es: string;
  };
}

interface RewardCardProps {
  reward: Reward;
  onRedeem: (reward: Reward) => void;
  availablePoints: number;
}

const getRewardTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    discount_percent: 'Percentage Discount',
    discount_amount: 'Dollar Discount',
    free_item: 'Free Item',
    free_delivery: 'Free Delivery',
    upgrade: 'Upgrade',
    custom: 'Special Reward',
  };
  return labels[type] || type;
};

const getRewardTypeIcon = (type: string) => {
  switch (type) {
    case 'free_item':
    case 'free_delivery':
      return <Gift className="h-4 w-4" />;
    case 'discount_percent':
    case 'discount_amount':
      return <Sparkles className="h-4 w-4" />;
    default:
      return <Gift className="h-4 w-4" />;
  }
};

export const RewardCard = ({ reward, onRedeem, availablePoints }: RewardCardProps) => {
  const canAfford = reward.can_afford;

  return (
    <Card
      className={`overflow-hidden transition-all ${
        canAfford
          ? 'hover:shadow-lg hover:scale-[1.02]'
          : 'opacity-75'
      }`}
    >
      {reward.image_url && (
        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
          <img
            src={getImageUrl(reward.image_url || '')}
            alt={reward.name}
            className="h-full w-full object-cover"
          />
          {!canAfford && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Lock className="h-8 w-8 text-white" />
            </div>
          )}
        </div>
      )}

      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight">{reward.name}</h3>
          <Badge variant={canAfford ? 'default' : 'secondary'} className="shrink-0">
            {reward.points_required.toLocaleString()} pts
          </Badge>
        </div>

        <Badge variant="outline" className="w-fit">
          {getRewardTypeIcon(reward.reward_type)}
          <span className="ml-1">{getRewardTypeLabel(reward.reward_type)}</span>
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        {reward.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {reward.description}
          </p>
        )}

        {reward.value && (
          <div className="text-sm">
            <span className="font-semibold">Value: </span>
            {reward.reward_type === 'discount_percent' ? (
              <span className="text-primary font-bold">{reward.value}% OFF</span>
            ) : (
              <span className="text-primary font-bold">${reward.value}</span>
            )}
          </div>
        )}

        {reward.menu_item && (
          <div className="text-sm">
            <span className="font-semibold">Includes: </span>
            <span>{reward.menu_item.name_en}</span>
          </div>
        )}

        {!canAfford && (
          <div className="text-sm text-destructive font-medium">
            Need {reward.points_short.toLocaleString()} more points
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          disabled={!canAfford}
          onClick={() => onRedeem(reward)}
          variant={canAfford ? 'default' : 'outline'}
        >
          {canAfford ? (
            <>
              <Gift className="mr-2 h-4 w-4" />
              Redeem Now
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Locked
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
