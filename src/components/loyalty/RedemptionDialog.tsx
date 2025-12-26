import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Gift, CheckCircle2, AlertCircle, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getImageUrl } from '@/utils/constants';

interface Reward {
  id: string;
  name: string;
  description?: string;
  points_required: number;
  reward_type: string;
  value?: number;
  terms?: string;
  image_url?: string;
}

interface RedemptionResult {
  id: string;
  redemption_code: string;
  points_spent: number;
  redeemed_at: string;
  expires_at?: string;
}

interface RedemptionDialogProps {
  open: boolean;
  onClose: () => void;
  reward: Reward | null;
  availablePoints: number;
  onConfirm: (rewardId: string) => Promise<RedemptionResult>;
}

export const RedemptionDialog = ({
  open,
  onClose,
  reward,
  availablePoints,
  onConfirm,
}: RedemptionDialogProps) => {
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redemptionResult, setRedemptionResult] = useState<RedemptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleConfirm = async () => {
    if (!reward) return;

    setIsRedeeming(true);
    setError(null);

    try {
      const result = await onConfirm(reward.id);
      setRedemptionResult(result);
      toast({
        title: 'Reward Redeemed!',
        description: `You've successfully redeemed ${reward.name}`,
        variant: 'default',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to redeem reward. Please try again.');
      toast({
        title: 'Redemption Failed',
        description: err.message || 'Failed to redeem reward',
        variant: 'destructive',
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleClose = () => {
    setRedemptionResult(null);
    setError(null);
    onClose();
  };

  const copyRedemptionCode = () => {
    if (redemptionResult) {
      navigator.clipboard.writeText(redemptionResult.redemption_code);
      toast({
        title: 'Copied!',
        description: 'Redemption code copied to clipboard',
      });
    }
  };

  if (!reward) return null;

  const pointsAfterRedemption = availablePoints - reward.points_required;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {!redemptionResult ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                Redeem Reward
              </DialogTitle>
              <DialogDescription>
                Review the details below and confirm your redemption
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Reward Details */}
              {reward.image_url && (
                <div className="relative h-32 w-full overflow-hidden rounded-lg">
                  <img
                    src={getImageUrl(reward.image_url || '')}
                    alt={reward.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div>
                <h3 className="font-semibold text-lg mb-1">{reward.name}</h3>
                {reward.description && (
                  <p className="text-sm text-muted-foreground">
                    {reward.description}
                  </p>
                )}
              </div>

              <Separator />

              {/* Points Summary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Current Points</span>
                  <span className="font-semibold">
                    {availablePoints.toLocaleString()} pts
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cost</span>
                  <span className="font-semibold text-primary">
                    -{reward.points_required.toLocaleString()} pts
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Points After</span>
                  <Badge variant={pointsAfterRedemption >= 0 ? 'default' : 'destructive'}>
                    {pointsAfterRedemption.toLocaleString()} pts
                  </Badge>
                </div>
              </div>

              {/* Terms */}
              {reward.terms && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    {reward.terms}
                  </AlertDescription>
                </Alert>
              )}

              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose} disabled={isRedeeming}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isRedeeming || availablePoints < reward.points_required}
              >
                {isRedeeming ? 'Redeeming...' : 'Confirm Redemption'}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                Redemption Successful!
              </DialogTitle>
              <DialogDescription>
                Your reward is ready to use
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  You've successfully redeemed <strong>{reward.name}</strong>!
                </AlertDescription>
              </Alert>

              {/* Redemption Code */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Your Redemption Code
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-3 bg-muted rounded-lg">
                    <code className="text-lg font-mono font-bold">
                      {redemptionResult.redemption_code}
                    </code>
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={copyRedemptionCode}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Show this code to staff when placing your order
                </p>
              </div>

              {/* Expiration */}
              {redemptionResult.expires_at && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Expires: </span>
                  <span className="font-semibold">
                    {new Date(redemptionResult.expires_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}

              <Separator />

              <div className="text-center text-sm text-muted-foreground">
                You can find this code in your redemption history
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleClose} className="w-full">
                Done
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
