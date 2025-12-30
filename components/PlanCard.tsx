import React, { useState, useEffect } from 'react';
import { Plan, AccountType } from '../types';

interface PlanCardProps {
  plan: Plan;
  onSelect: (plan: Plan, type: AccountType) => void;
  isLoading: boolean;
  stockCount: number; // Receive stock info
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, onSelect, isLoading, stockCount }) => {
  // Determine initial selected type
  const [selectedType, setSelectedType] = useState<AccountType>(
    plan.hasSharing ? 'SHARING' : 'PRIVATE'
  );

  // Update selection if props change (e.g. if plan only has Private)
  useEffect(() => {
    if (!plan.hasSharing && plan.hasPrivate) {
      setSelectedType('PRIVATE');
    } else if (plan.hasSharing && !plan.hasPrivate) {
      setSelectedType('SHARING');
    }
  }, [plan]);

  // Determine current price to display
  const currentPrice = selectedType === 'SHARING' 
    ? (plan.sharingPrice || plan.price) 
    : (plan.privatePrice || plan.price);
    
  const currentOriginalPrice = selectedType === 'SHARING'
    ? plan.sharingOriginalPrice
    : plan.privateOriginalPrice;

  const discount = currentOriginalPrice && currentOriginalPrice > currentPrice
    ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
    : 0;

  const isOutOfStock = stockCount === 0;

  return (
    <div className={`relative flex flex-col p-6 rounded-2xl border ${plan.recommended ? 'border-brand-500 bg-brand-900/20' : 'border-gray-800 bg-dark-800'} transition-all hover:scale-105`}>
      {plan.recommended && (
        <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_10px_rgba(0,210,106,0.5)]">
          PALING LARIS
        </span>
      )}
      
      {discount > 0 && (
        <span className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
          HEMAT {discount}%
        </span>
      )}

      <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>

      {/* Type Toggle */}
      <div className="flex bg-black rounded-lg p-1 mb-4 border border-gray-700">
        {plan.hasSharing && (
          <button
            onClick={() => setSelectedType('SHARING')}
            className={`flex-1 py-1 text-xs font-bold rounded ${
              selectedType === 'SHARING' 
                ? 'bg-brand-500 text-black' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            SHARING
          </button>
        )}
        {plan.hasPrivate && (
          <button
            onClick={() => setSelectedType('PRIVATE')}
            className={`flex-1 py-1 text-xs font-bold rounded ${
              selectedType === 'PRIVATE' 
                ? 'bg-white text-black' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            PRIVATE
          </button>
        )}
        {!plan.hasSharing && !plan.hasPrivate && (
           <div className="flex-1 py-1 text-xs text-center text-gray-500">Standard License</div>
        )}
      </div>
      
      <div className="mb-4">
        {currentOriginalPrice && currentOriginalPrice > currentPrice && (
          <div className="text-gray-500 text-sm line-through decoration-red-500">
            Rp {currentOriginalPrice.toLocaleString('id-ID')}
          </div>
        )}
        <div className="flex items-baseline">
          <span className="text-sm text-gray-400">Rp</span>
          <span className="text-4xl font-extrabold text-white mx-1">{currentPrice.toLocaleString('id-ID')}</span>
          <span className="text-gray-400">/{plan.duration}</span>
        </div>
        <div className="mt-1 text-xs text-brand-500 font-medium">
          {selectedType === 'SHARING' ? '⚠️ Akun dipakai bersama' : '✅ Akun khusus milikmu (Pribadi)'}
        </div>
      </div>
      
      <ul className="flex-1 space-y-3 mb-6">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-center text-gray-300 text-sm">
            <svg className="w-4 h-4 mr-2 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect(plan, selectedType)}
        disabled={isLoading || isOutOfStock}
        className={`w-full py-3 rounded-xl font-bold transition-colors ${
          isOutOfStock 
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
            : plan.recommended 
              ? 'bg-brand-500 hover:bg-brand-600 text-black shadow-lg shadow-brand-500/20' 
              : 'bg-gray-700 hover:bg-gray-600 text-white'
        } disabled:opacity-80`}
      >
        {isLoading ? 'Memproses...' : isOutOfStock ? 'STOK HABIS' : 'Beli Sekarang'}
      </button>
    </div>
  );
};