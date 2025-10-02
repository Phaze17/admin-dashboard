export type UserRole = 'admin' | 'campaign_manager' | 'analyst' | 'operator';
export type CampaignStatus = 'active' | 'paused' | 'completed' | 'error' | 'draft';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  mfa_enabled: boolean;
  preferences: {
    theme: 'dark' | 'light';
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: CampaignStatus;
  owner_id?: string;
  budget?: number;
  spent: number;
  created_at: string;
  updated_at: string;
}
