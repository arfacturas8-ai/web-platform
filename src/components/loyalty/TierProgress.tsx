import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, ChevronRight } from 'lucide-react';

interface Tier {
  id: string;
  name: string;
  level: string;
  min_points: number;
  color: string;
  icon?: string;
  description?: string;
  benefits?: Record<string, any>;
  is_active: boolean;
  display_order: number;
}

interface TierProgressProps {
  tiers: Tier[];
  currentTier?: Tier;
  lifetimeEarned: number;
}

export const TierProgress = ({ tiers, currentTier, lifetimeEarned }: TierProgressProps) => {
  const sortedTiers = [...tiers].sort((a, b) => a.min_points - b.min_points);
  const maxPoints = sortedTiers[sortedTiers.length - 1]?.min_points || 1000;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Loyalty Tiers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {sortedTiers.map((tier, index) => {
            const isCurrentTier = currentTier?.id === tier.id;
            const isAchieved = lifetimeEarned >= tier.min_points;
            const nextTier = sortedTiers[index + 1];
            const progress = nextTier
              ? Math.min(
                  ((lifetimeEarned - tier.min_points) /
                    (nextTier.min_points - tier.min_points)) *
                    100,
                  100
                )
              : 100;

            return (
              <div
                key={tier.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isCurrentTier
                    ? 'border-primary bg-primary/5'
                    : isAchieved
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-border bg-background'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4
                        className="font-semibold"
                        style={{ color: isCurrentTier || isAchieved ? tier.color : undefined }}
                      >
                        {tier.name}
                      </h4>
                      {isCurrentTier && (
                        <Badge variant="default" className="text-xs">
                          Current
                        </Badge>
                      )}
                      {isAchieved && !isCurrentTier && (
                        <Badge variant="outline" className="text-xs border-green-500 text-green-500">
                          Achieved
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {tier.description || `Reach ${tier.min_points.toLocaleString()} points`}
                    </p>
                  </div>
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-sm"
                    style={{ backgroundColor: tier.color }}
                  >
                    {tier.min_points === 0 ? '★' : tier.min_points >= 5000 ? '★★★' : tier.min_points >= 3000 ? '★★' : '★'}
                  </div>
                </div>

                {/* Benefits */}
                {tier.benefits && (
                  <div className="mt-2 space-y-1">
                    {tier.benefits.point_multiplier && tier.benefits.point_multiplier > 1 && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <ChevronRight className="h-3 w-3 text-primary" />
                        <span>{tier.benefits.point_multiplier}x points</span>
                      </div>
                    )}
                    {tier.benefits.free_delivery && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <ChevronRight className="h-3 w-3 text-primary" />
                        <span>Free delivery</span>
                      </div>
                    )}
                    {tier.benefits.early_access && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <ChevronRight className="h-3 w-3 text-primary" />
                        <span>Early access</span>
                      </div>
                    )}
                    {tier.benefits.priority_support && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <ChevronRight className="h-3 w-3 text-primary" />
                        <span>Priority support</span>
                      </div>
                    )}
                    {tier.benefits.exclusive_events && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <ChevronRight className="h-3 w-3 text-primary" />
                        <span>Exclusive events</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Progress to next tier */}
                {isCurrentTier && nextTier && (
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Progress to {nextTier.name}
                      </span>
                      <span className="font-semibold">
                        {nextTier.min_points - lifetimeEarned} pts to go
                      </span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Overall Progress Bar */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-semibold">
              {lifetimeEarned.toLocaleString()} / {maxPoints.toLocaleString()} pts
            </span>
          </div>
          <Progress
            value={(lifetimeEarned / maxPoints) * 100}
            className="h-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};
