export type AccountType = 'SHARING' | 'PRIVATE';

export interface Plan {
  id: string;
  name: string;
  
  // Legacy/Base price fields (kept for compatibility, though logic will prioritize specific types)
  price: number; 
  originalPrice?: number;
  
  // New Option Fields
  hasSharing?: boolean;
  sharingPrice?: number;
  sharingOriginalPrice?: number;
  
  hasPrivate?: boolean;
  privatePrice?: number;
  privateOriginalPrice?: number;

  duration: string;
  features: string[];
  recommended?: boolean;
}

export interface Announcement {
  text: string;
  isActive: boolean;
}

export interface Credentials {
  email: string;
  password?: string; // Made optional as some accounts use links
  accessLink?: string; // New field for the generator email link
  expiresAt: string;
}

export type TransactionType = 'TOPUP' | 'PURCHASE';

export interface Transaction {
  id: string;
  username: string;
  type: TransactionType;
  planId?: string;
  amount: number;
  timestamp: Date;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  credentials?: Credentials;
  paymentMethod?: string;
  accountType?: AccountType; // Added to track if user bought Sharing or Private
}

export interface User {
  username: string;
  password?: string; // Security update: Store password
  balance: number;
  transactions: Transaction[];
  role?: 'admin' | 'user';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type PaymentMethod = 'DANA' | 'GOPAY' | 'OVO' | 'SHOPEEPAY' | 'QRIS';