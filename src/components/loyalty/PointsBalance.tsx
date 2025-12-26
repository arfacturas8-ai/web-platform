import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, TrendingUp, Gift } from 'lucide-react';

interface Tier {
  id: string;
  name: string;
  level: string;
  color: string;
  icon?: string;
  benefits?: Record<string, any>;
  min_points: number;
}

interface PointsBalanceProps {
  availablePoints: number;
  lifetimeEarned: number;
  lifetimeRedeemed: number;
  currentTier?: Tier;
  nextTier?: {
    id: string;
    name: string;
    level: string;
    min_points: number;
    points_needed: number;
  };
}

export const PointsBalance = ({
  availablePoints,
  lifetimeEarned,
  lifetimeRedeemed,
  currentTier,
  nextTier,
}: PointsBalanceProps) => {
  const progressToNextTier = nextTier
    ? ((lifetimeEarned - (currentTier?.min_points || 0)) /
        (nextTier.min_points - (currentTier?.min_points || 0))) *
      100
    : 100;

  return (
    <div className="space-y-4">
      {/* Main Points Card */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Your Loyalty Points
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Available Points */}
          <div className="text-center">
            <div className="text-5xl font-bold text-primary">
              {availablePoints.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Available Points
            </p>
          </div>

          {/* Current Tier Badge */}
          {currentTier && (
            <div className="flex justify-center">
              <Badge
                style={{
                  backgroundColor: currentTier.color || '#CD7F32',
                  color: 'white',
                }}
                className="px-4 py-2 text-base"
              >
                {currentTier.name} Tier
              </Badge>
            </div>
          )}

          {/* Progress to Next Tier */}
          {nextTier && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Progress to {nextTier.name}
                </span>
                <span className="font-semibold">
                  {nextTier.points_needed} points to go
                </span>
              </div>
              <Progress value={progressToNextTier} className="h-2" />
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-green-600">
                <TrendingUp className="h-5 w-5" />
                {lifetimeEarned.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Lifetime Earned
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-purple-600">
                <Gift className="h-5 w-5" />
                {lifetimeRedeemed.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Lifetime Redeemed
              </p>
            </div>
          </div>

          {/* Tier Benefits */}
          {currentTier?.benefits && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold mb-2">Your Benefits:</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                {currentTier.benefits.point_multiplier &&
                  currentTier.benefits.point_multiplier > 1 && (
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>
                        Earn {currentTier.benefits.point_multiplier}x points on
                        purchases
                      </span>
                    </div>
                  )}
                {currentTier.benefits.free_delivery && (
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Free delivery on all orders</span>
                  </div>
                )}
                {currentTier.benefits.early_access && (
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Early access to new menu items</span>
                  </div>
                )}
                {currentTier.benefits.priority_support && (
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Priority customer support</span>
                  </div>
                )}
                {currentTier.benefits.exclusive_events && (
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Exclusive event invitations</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
