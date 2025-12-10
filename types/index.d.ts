export interface Profile {
  id: string; // UUID
  role: string;
  username: string;
  full_name: string;
  avatar_url: string;
  credits_balance: number;
  total_credits_earned: number;
  role: "user" | "admin" | "moderator";
  twitter_handle?: string;
}

export interface Post {
  id: string; // UUID
  user_id: string; // UUID references Profile.id
  tweet_id: string;
  original_url: string;
  type: "tweet" | "profile";
  status: "active" | "archived";
  current_engagements: number;
}

export interface CreditLedger {
  id: string; // UUID
  amount: number;
  transaction_type: string; // Could be 'earn', 'boost', 'refund', etc.
  description: string;
  created_at: string; // ISO timestamp
}

export interface Interaction {
  id: string; // UUID
  user_id: string; // UUID references Profile.id
  post_id: string; // UUID references Post.id
  verified_at: string; // ISO timestamp
}
