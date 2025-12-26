// Loyalty Program Type Definitions

export interface LoyaltyProgram {
  id: string;
  name: string;
  description?: string;
  points_per_dollar: number;
  minimum_purchase_amount: number;
  points_expire_days?: number;
  birthday_bonus_points: number;
  referral_points_referrer: number;
  referral_points_referee: number;
  settings?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tier {
  id: string;
  name: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  min_points: number;
  benefits?: {
    point_multiplier?: number;
    birthday_multiplier?: number;
    free_delivery?: boolean;
    early_access?: boolean;
    priority_support?: boolean;
    exclusive_events?: boolean;
    [key: string]: any;
  };
  color: string;
  icon?: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerPoints {
  id: string;
  customer_id: string;
  total_points: number;
  available_points: number;
  lifetime_earned: number;
  lifetime_redeemed: number;
  current_tier_id?: string;
  tier_achieved_at?: string;
  total_transactions: number;
  last_earned_at?: string;
  last_redeemed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PointsBalance {
  customer_id: string;
  total_points: number;
  available_points: number;
  lifetime_earned: number;
  lifetime_redeemed: number;
  current_tier?: Tier;
  next_tier?: {
    id: string;
    name: string;
    level: string;
    min_points: number;
    points_needed: number;
  };
  total_transactions: number;
  last_earned_at?: string;
  last_redeemed_at?: string;
}

export type TransactionType = 'earned' | 'redeemed' | 'expired' | 'adjusted' | 'bonus' | 'refund';

export interface PointsTransaction {
  id: string;
  customer_points_id: string;
  customer_id: string;
  points: number;
  transaction_type: TransactionType;
  order_id?: string;
  reward_redemption_id?: string;
  description?: string;
  metadata?: Record<string, any>;
  expires_at?: string;
  created_at: string;
}

export type RewardType =
  | 'discount_percent'
  | 'discount_amount'
  | 'free_item'
  | 'free_delivery'
  | 'upgrade'
  | 'custom';

export interface Reward {
  id: string;
  name: string;
  description?: string;
  points_required: number;
  reward_type: RewardType;
  value?: number;
  menu_item_id?: string;
  min_tier_id?: string;
  is_active: boolean;
  available_from?: string;
  available_until?: string;
  max_redemptions_per_customer?: number;
  total_available?: number;
  total_redeemed: number;
  image_url?: string;
  display_order: number;
  terms?: string;
  created_at: string;
  updated_at: string;
}

export interface RewardWithAvailability extends Reward {
  can_afford: boolean;
  points_short: number;
  menu_item?: {
    id: string;
    name_en: string;
    name_es: string;
  };
}

export interface RewardRedemption {
  id: string;
  customer_id: string;
  reward_id: string;
  points_spent: number;
  redemption_code: string;
  redeemed_at: string;
  order_id?: string;
  used_at?: string;
  expires_at?: string;
  is_used: boolean;
  is_expired: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface LeaderboardEntry {
  rank: number;
  customer_id: string;
  customer_name: string;
  total_points: number;
  available_points: number;
  tier: string;
}

export interface LoyaltyStatistics {
  total_members: number;
  total_points_issued: number;
  total_points_redeemed: number;
  total_rewards_redeemed: number;
  active_members_30d: number;
  tier_distribution: Record<string, number>;
  top_rewards: Array<{
    name: string;
    points_required: number;
    redemption_count: number;
  }>;
}

// Request types
export interface RewardRedemptionRequest {
  reward_id: string;
}

export interface PointsAdjustmentRequest {
  customer_id: string;
  points: number;
  description?: string;
  metadata?: Record<string, any>;
}

// Response types
export interface RedemptionValidateResponse {
  can_redeem: boolean;
  reason?: string;
}
