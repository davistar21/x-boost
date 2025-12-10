export type UserRole = "user" | "admin" | "moderator";
export type PostType = "tweet" | "profile";
export type PostStatus = "active" | "archived";
export type TransactionType = "earn" | "boost" | "refund" | "deposit"; // inferred common types

export interface Profile {
  id: string; // uuid
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  credits_balance: number;
  total_credits_earned: number;
  role: UserRole;
  twitter_handle: string | null;
  is_verified: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string; // uuid
  user_id: string; // uuid
  tweet_id: string;
  original_url: string;
  type: PostType;
  status: PostStatus;
  target_engagements: number | null;
  current_engagements: number;
  created_at: string;
  expires_at: string | null;
}

export interface Interaction {
  id: string; // uuid
  user_id: string; // uuid
  post_id: string; // uuid
  clicked_at: string;
  verified_at: string | null;
  is_valid: boolean | null;
}

export interface CreditLedger {
  id: string; // uuid
  user_id: string; // uuid
  amount: number;
  transaction_type: TransactionType;
  description: string | null;
  metadata: Record<string, any> | null; // jsonb
  created_at: string;
}

export interface AppConfig {
  key: string;
  value: Record<string, any>; // jsonb
  description: string | null;
}
