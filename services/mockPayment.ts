import { Credentials, Transaction } from '../types';

// Simulate a delay for payment processing
export const processMockPayment = async (planId: string, amount: number, username: string = 'mock_user'): Promise<Transaction> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const randomId = Math.floor(Math.random() * 10000);
      const now = new Date();
      
      const credentials: Credentials = {
        email: `am_premium_${randomId}@gmail.com`,
        password: `Pass${Math.random().toString(36).slice(-8)}!`,
        expiresAt: new Date(now.setMonth(now.getMonth() + 1)).toISOString().split('T')[0]
      };

      const transaction: Transaction = {
        id: `TRX-${Date.now()}`,
        username,
        type: 'PURCHASE',
        planId,
        amount,
        timestamp: new Date(),
        status: 'SUCCESS',
        credentials
      };
      
      resolve(transaction);
    }, 2500); // 2.5s delay to simulate "Connecting to Gateway..."
  });
};