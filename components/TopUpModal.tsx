import React, { useState, useEffect } from 'react';
import { PaymentMethod } from '../types';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRequest: (amount: number, method: PaymentMethod) => void;
}

type Step = 'AMOUNT' | 'METHOD' | 'PAYMENT' | 'PENDING_INFO';

export const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, onClose, onSubmitRequest }) => {
  const [step, setStep] = useState<Step>('AMOUNT');
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [uniqueCode, setUniqueCode] = useState(0);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep('AMOUNT');
      setAmount(0);
      setMethod(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAmountSelect = (val: number) => {
    setAmount(val);
    setStep('METHOD');
  };

  const handleMethodSelect = (m: PaymentMethod) => {
    setMethod(m);
    setUniqueCode(Math.floor(Math.random() * 999)); 
    setStep('PAYMENT');
  };

  const handlePaymentConfirm = () => {
    if (method) {
      onSubmitRequest(amount + uniqueCode, method);
      setStep('PENDING_INFO');
    }
  };

  const totalToPay = amount + uniqueCode;

  // List of E-Wallets
  const eWallets: PaymentMethod[] = ['DANA', 'GOPAY', 'OVO', 'SHOPEEPAY', 'QRIS'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-dark-800 w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gray-900 p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="font-bold text-white">Top Up Saldo</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="p-6 overflow-y-auto">
          {step === 'AMOUNT' && (
            <div className="space-y-4">
              <p className="text-gray-300 text-sm mb-4">Pilih nominal top up:</p>
              <div className="grid grid-cols-2 gap-3">
                {[10000, 20000, 50000, 100000].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleAmountSelect(val)}
                    className="p-4 bg-gray-800 border border-gray-700 rounded-xl hover:border-brand-500 hover:bg-gray-700 transition-all text-left"
                  >
                    <span className="block text-brand-500 font-bold">Rp {val.toLocaleString('id-ID')}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'METHOD' && (
            <div className="space-y-3">
              <p className="text-gray-300 text-sm mb-2">Pilih E-Wallet:</p>
              {eWallets.map((m) => (
                <button
                  key={m}
                  onClick={() => handleMethodSelect(m)}
                  className="w-full p-4 flex justify-between items-center bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 transition-all"
                >
                  <div className="flex items-center">
                    {/* Icon Placeholder based on name first letter */}
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3 font-bold text-brand-500">
                      {m[0]}
                    </div>
                    <span className="font-bold text-white">{m}</span>
                  </div>
                  <span className="text-gray-400 text-xs">Otomatis</span>
                </button>
              ))}
              <button onClick={() => setStep('AMOUNT')} className="text-sm text-gray-500 mt-4 underline">Kembali</button>
            </div>
          )}

          {step === 'PAYMENT' && method && (
            <div className="text-center">
              <div className="bg-yellow-900/20 border border-yellow-600/50 p-3 rounded-lg mb-6">
                <p className="text-yellow-500 text-sm">Transfer nominal <b>PERSIS</b> (termasuk 3 digit terakhir) agar Admin mudah memverifikasi.</p>
              </div>

              <p className="text-gray-400 text-sm mb-1">Total Pembayaran</p>
              <h2 className="text-3xl font-mono font-bold text-brand-500 mb-6">
                Rp {totalToPay.toLocaleString('id-ID')}
              </h2>

              <div className="bg-white p-4 rounded-xl mb-6 inline-block w-full max-w-xs">
                {/* QRIS / E-Wallet Info */}
                {method === 'QRIS' ? (
                   <div className="bg-white text-black p-2 rounded-lg border border-gray-300">
                     <div className="text-center mb-4 border-b border-gray-100 pb-2">
                        <h3 className="font-bold text-md uppercase tracking-wide leading-tight">BINTANG CAHYO WICAKSONO</h3>
                        <p className="text-gray-500 font-mono text-sm">(+62) 853-3010-5729</p>
                     </div>
                     
                     <div className="aspect-square bg-gray-100 flex items-center justify-center border-2 border-black rounded-lg mb-2 p-2 relative">
                        {/* Placeholder QR - User should replace src with real image path if hosting */}
                        <img 
                          src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020101021226590014ID.LINKAJA.WWW01189360091100220023402100853301057290303UMI51440014ID.CO.QRIS.WWW0215ID10200505166140303UMI5204541153033605802ID5923BINTANG CAHYO WICAKSONO6013KAB. NGANJUK610564411621501111025215729116304E6C3" 
                          alt="Scan QRIS" 
                          className="w-full h-full object-contain"
                        />
                     </div>
                     
                     <div className="text-center">
                        <p className="text-[10px] text-gray-500 leading-tight">
                          Terima uang dari semua bank dan e-wallet pakai QRIS ShopeePay
                        </p>
                     </div>
                   </div>
                ) : (
                  <div className="text-black text-left">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs text-gray-500 uppercase font-bold">Nomor {method}</p>
                      <span className="bg-brand-100 text-brand-800 text-[10px] font-bold px-2 py-0.5 rounded">ADMIN</span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-100 p-2 rounded border border-gray-300">
                      <p className="font-mono text-lg font-bold tracking-wider text-gray-800">0853-3010-5729</p>
                      <button 
                        onClick={() => navigator.clipboard.writeText("085330105729")}
                        className="text-brand-600 text-xs font-bold hover:underline"
                      >
                        SALIN
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">A/N: BINN PRESET STORE (BINTANG CAHYO)</p>
                  </div>
                )}
              </div>

              <button
                onClick={handlePaymentConfirm}
                className="w-full bg-brand-500 hover:bg-brand-600 text-black font-bold py-3 rounded-xl transition-colors mb-3"
              >
                Saya Sudah Transfer
              </button>

              <button
                onClick={onClose}
                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 font-bold py-3 rounded-xl transition-colors"
              >
                Batalkan Pembayaran
              </button>
            </div>
          )}

          {step === 'PENDING_INFO' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                 <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-white">Menunggu Konfirmasi Admin</h3>
              <p className="text-gray-400 text-sm mt-2 mb-6">
                Permintaan top up Anda telah dikirim ke Developer Dashboard. 
                Saldo akan masuk otomatis setelah Admin menyetujui transaksi Anda.
              </p>
              <button
                onClick={onClose}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg transition-colors"
              >
                Tutup & Tunggu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};