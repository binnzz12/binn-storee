import React, { useState } from 'react';
import { Transaction, Plan, Announcement } from '../types';

interface DeveloperDashboardProps {
  balance: number;
  transactions: Transaction[]; 
  pendingTopUps: Transaction[];
  plans: Plan[];
  announcement: Announcement;
  stockCount: number; // New Prop to show stock
  onUpdateAnnouncement: (ann: Announcement) => void;
  onUpdatePlan: (updatedPlan: Plan) => void;
  onApproveTopUp: (transaction: Transaction) => void;
  onRejectTopUp: (transactionId: string) => void;
  onResetStock: () => void; // New Prop to reset stock
  onClose: () => void;
}

type Tab = 'OVERVIEW' | 'REQUESTS' | 'PRODUCTS';

export const DeveloperDashboard: React.FC<DeveloperDashboardProps> = ({ 
  balance, 
  transactions, 
  pendingTopUps,
  plans,
  announcement,
  stockCount,
  onUpdateAnnouncement,
  onUpdatePlan,
  onApproveTopUp,
  onRejectTopUp,
  onResetStock,
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('REQUESTS'); 

  // Local state for announcement editing
  const [announcementText, setAnnouncementText] = useState(announcement.text);
  const [announcementActive, setAnnouncementActive] = useState(announcement.isActive);

  const handleSaveAnnouncement = () => {
    onUpdateAnnouncement({
      text: announcementText,
      isActive: announcementActive
    });
    alert("Event text updated!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-dark-800 w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 p-6 flex justify-between items-center border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Developer Dashboard</h2>
            <div className="flex space-x-4 mt-2">
               <button 
                onClick={() => setActiveTab('REQUESTS')}
                className={`text-sm font-medium pb-1 border-b-2 transition-colors flex items-center ${activeTab === 'REQUESTS' ? 'text-brand-500 border-brand-500' : 'text-gray-400 border-transparent hover:text-white'}`}
              >
                Request Top Up
                {pendingTopUps.length > 0 && (
                  <span className="ml-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                    {pendingTopUps.length}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setActiveTab('OVERVIEW')}
                className={`text-sm font-medium pb-1 border-b-2 transition-colors ${activeTab === 'OVERVIEW' ? 'text-brand-500 border-brand-500' : 'text-gray-400 border-transparent hover:text-white'}`}
              >
                Event & Saldo
              </button>
              <button 
                onClick={() => setActiveTab('PRODUCTS')}
                className={`text-sm font-medium pb-1 border-b-2 transition-colors ${activeTab === 'PRODUCTS' ? 'text-brand-500 border-brand-500' : 'text-gray-400 border-transparent hover:text-white'}`}
              >
                Atur Harga & Promo
              </button>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white self-start">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'REQUESTS' && (
             <div className="animate-fade-in">
               <h4 className="text-lg font-semibold mb-4 text-white">Permintaan Top Up Masuk ({pendingTopUps.length})</h4>
               {pendingTopUps.length === 0 ? (
                 <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-dashed border-gray-800">
                   <p className="text-gray-500">Tidak ada permintaan top up saat ini.</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                   {pendingTopUps.map((trx) => (
                     <div key={trx.id} className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-brand-500 font-bold text-lg">Rp {trx.amount.toLocaleString('id-ID')}</span>
                            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded uppercase">{trx.paymentMethod}</span>
                          </div>
                          <div className="text-sm text-gray-400">
                            User: <span className="text-white font-bold">{trx.username}</span> • {new Date(trx.timestamp).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">ID: {trx.id}</div>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <button 
                            onClick={() => onRejectTopUp(trx.id)}
                            className="flex-1 md:flex-none px-4 py-2 bg-red-900/30 text-red-500 border border-red-900/50 rounded-lg hover:bg-red-900/50 transition-colors text-sm font-bold"
                          >
                            Tolak
                          </button>
                          <button 
                            onClick={() => onApproveTopUp(trx)}
                            className="flex-1 md:flex-none px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-500 transition-colors shadow-lg shadow-brand-500/20 text-sm font-bold"
                          >
                            Terima (Approve)
                          </button>
                        </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>
          )}

          {activeTab === 'OVERVIEW' && (
            <div className="animate-fade-in">
              {/* Event / Running Text Config */}
              <div className="bg-gray-800/50 border border-brand-500/20 p-5 rounded-xl mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-white font-bold flex items-center">
                    <span className="text-xl mr-2">📢</span> Pengumuman Event (Running Text)
                  </h4>
                  <label className="flex items-center cursor-pointer">
                    <span className="mr-2 text-sm text-gray-400">Tampilkan?</span>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={announcementActive}
                        onChange={(e) => setAnnouncementActive(e.target.checked)}
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${announcementActive ? 'bg-brand-500' : 'bg-gray-600'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${announcementActive ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                  </label>
                </div>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder="Contoh: DISKON BESAR HARI INI..."
                    className="flex-1 bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-brand-500 outline-none"
                  />
                  <button 
                    onClick={handleSaveAnnouncement}
                    className="bg-brand-500 text-black font-bold px-4 py-2 rounded hover:bg-brand-600"
                  >
                    Simpan
                  </button>
                </div>
              </div>

              {/* STOCK & BALANCE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                 <div className="bg-gradient-to-r from-brand-900 to-dark-900 border border-brand-500/30 p-6 rounded-xl">
                  <p className="text-gray-400 mb-1">Total Pendapatan (IDR)</p>
                  <h3 className="text-4xl font-mono font-bold text-brand-500">
                    Rp {balance.toLocaleString('id-ID')}
                  </h3>
                </div>
                
                <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl flex flex-col justify-center relative group">
                   <p className="text-gray-400 mb-1">Stok Akun Tersedia</p>
                   <h3 className="text-4xl font-mono font-bold text-white">
                    {stockCount} <span className="text-sm font-sans text-brand-500 font-normal">Akun Premium</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-2">Sistem otomatis mengambil acak dari stok ini.</p>
                  
                  {/* Reset Stock Button */}
                  <button 
                    onClick={onResetStock}
                    className="absolute top-4 right-4 bg-gray-700 hover:bg-brand-500 hover:text-black text-gray-300 text-xs px-3 py-1.5 rounded transition-colors font-bold"
                  >
                    ⟳ Reset Stok (30)
                  </button>
                </div>
              </div>

              <h4 className="text-lg font-semibold mb-4 text-white">Riwayat Penjualan</h4>
              <div className="space-y-2">
                {transactions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Belum ada penjualan.</p>
                ) : (
                  transactions.slice().reverse().map((trx) => (
                    <div key={trx.id} className="flex justify-between items-center bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{trx.id}</span>
                        <div className="flex gap-2 text-xs text-gray-500">
                          <span>{trx.timestamp.toLocaleString()}</span>
                          {trx.accountType && <span className="text-brand-500 font-bold uppercase">[{trx.accountType}]</span>}
                        </div>
                      </div>
                      <div className="text-right">
                         <span className="block text-brand-500 font-bold">+ Rp {trx.amount.toLocaleString('id-ID')}</span>
                         <span className="text-xs text-green-400 bg-green-900/30 px-2 py-0.5 rounded-full">Success</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'PRODUCTS' && (
            <div className="animate-fade-in space-y-6">
              <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg mb-6">
                <p className="text-blue-400 text-sm">💡 <b>Realtime Update:</b> Perubahan harga yang Anda simpan di sini akan langsung muncul di halaman utama.</p>
              </div>

              <div className="grid gap-6">
                {plans.map((plan) => (
                  <PlanEditor key={plan.id} plan={plan} onUpdate={onUpdatePlan} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-component for editing a single plan
const PlanEditor: React.FC<{ plan: Plan; onUpdate: (p: Plan) => void }> = ({ plan, onUpdate }) => {
  const [editedPlan, setEditedPlan] = useState(plan);
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (field: keyof Plan, value: any) => {
    setEditedPlan(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    onUpdate(editedPlan);
    setIsDirty(false);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-4">
      {/* Top Header */}
      <div className="flex justify-between items-start">
        <div className="w-full mr-4">
           <label className="text-xs text-gray-500 uppercase">Nama Paket</label>
           <input 
            type="text" 
            value={editedPlan.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white font-bold focus:border-brand-500 outline-none"
          />
        </div>
        <div className="flex items-center space-x-2 mt-6">
            <input 
              type="checkbox" 
              checked={editedPlan.recommended || false}
              onChange={(e) => handleChange('recommended', e.target.checked)}
              className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-brand-500 focus:ring-brand-500"
            />
            <span className={`text-xs font-bold whitespace-nowrap ${editedPlan.recommended ? 'text-brand-500' : 'text-gray-500'}`}>
              BEST SELLER
            </span>
        </div>
      </div>
      
      {/* SHARING CONFIG */}
      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center mb-3">
          <input 
             type="checkbox"
             checked={editedPlan.hasSharing || false}
             onChange={(e) => handleChange('hasSharing', e.target.checked)}
             className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-brand-500 mr-2"
          />
          <span className="text-white font-bold text-sm">Opsi Sharing (Murah)</span>
        </div>
        
        {editedPlan.hasSharing && (
          <div className="grid grid-cols-2 gap-4 pl-6">
            <div>
              <label className="text-xs text-gray-500 uppercase">Harga Jual</label>
              <input 
                type="number" 
                value={editedPlan.sharingPrice || 0}
                onChange={(e) => handleChange('sharingPrice', Number(e.target.value))}
                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Harga Coret</label>
              <input 
                type="number" 
                value={editedPlan.sharingOriginalPrice || 0}
                onChange={(e) => handleChange('sharingOriginalPrice', Number(e.target.value))}
                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-gray-400 text-sm focus:border-brand-500 outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* PRIVATE CONFIG */}
      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
         <div className="flex items-center mb-3">
          <input 
             type="checkbox"
             checked={editedPlan.hasPrivate || false}
             onChange={(e) => handleChange('hasPrivate', e.target.checked)}
             className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-white mr-2"
          />
          <span className="text-white font-bold text-sm">Opsi Private (Mahal)</span>
        </div>
        
        {editedPlan.hasPrivate && (
          <div className="grid grid-cols-2 gap-4 pl-6">
            <div>
              <label className="text-xs text-gray-500 uppercase">Harga Jual</label>
              <input 
                type="number" 
                value={editedPlan.privatePrice || 0}
                onChange={(e) => handleChange('privatePrice', Number(e.target.value))}
                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Harga Coret</label>
              <input 
                type="number" 
                value={editedPlan.privateOriginalPrice || 0}
                onChange={(e) => handleChange('privateOriginalPrice', Number(e.target.value))}
                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-gray-400 text-sm focus:border-brand-500 outline-none"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        {isDirty ? (
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-black font-bold rounded-lg transition-colors"
          >
            Simpan Perubahan
          </button>
        ) : (
          <span className="text-gray-600 text-sm flex items-center px-6 py-2">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            Tersimpan
          </span>
        )}
      </div>
    </div>
  );
};