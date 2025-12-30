import React, { useState, useEffect } from 'react';
import { Plan, Transaction, User, Credentials, PaymentMethod, AccountType, Announcement } from './types';
import { PlanCard } from './components/PlanCard';
import { DeveloperDashboard } from './components/DeveloperDashboard';
import { ChatWidget } from './components/ChatWidget';
import { AuthModal } from './components/AuthModal';
import { TopUpModal } from './components/TopUpModal';

// --- INITIAL STOCK DATA (30 Accounts) ---
// This serves as the initial database. Once the app loads, it uses localStorage 'app_stock_data'.
const INITIAL_STOCK = [
  { email: "chynadoll714@dmxs8.com", link: "https://generator.email/chynadoll714@dmxs8.com" },
  { email: "hrustunk@imaanpharmacy.com", link: "https://generator.email/hrustunk@imaanpharmacy.com" },
  { email: "zalkinata082@doremifasoleando.es", link: "https://generator.email/zalkinata082@doremifasoleando.es" },
  { email: "thathaalmeida10@chatgpt-ar.com", link: "https://generator.email/thathaalmeida10@chatgpt-ar.com" },
  { email: "residentevil2011199@mlgmail.top", link: "https://generator.email/residentevil2011199@mlgmail.top" },
  { email: "zonghen1@boranora.com", link: "https://generator.email/zonghen1@boranora.com" },
  { email: "viktoriaelt@wotomail.com", link: "https://generator.email/viktoriaelt@wotomail.com" },
  { email: "tourmax@edgepodlab.com", link: "https://generator.email/tourmax@edgepodlab.com" },
  { email: "zakikhan120@luxsev.com", link: "https://generator.email/zakikhan120@luxsev.com" },
  { email: "ivan758366@newgoldkey.com", link: "https://generator.email/ivan758366@newgoldkey.com" },
  { email: "afra2011@effortlessinneke.io", link: "https://generator.email/afra2011@effortlessinneke.io" },
  { email: "ebskrx@hotmail-us.top", link: "https://generator.email/ebskrx@hotmail-us.top" },
  { email: "squirttest@strongnutricion.es", link: "https://generator.email/squirttest@strongnutricion.es" },
  { email: "privitalik@via17.com", link: "https://generator.email/privitalik@via17.com" },
  { email: "veronikaanisimova@chupanhcuoidep.com", link: "https://generator.email/veronikaanisimova@chupanhcuoidep.com" },
  { email: "djrusselll@available-home.com", link: "https://generator.email/djrusselll@available-home.com" },
  { email: "wrightstuff2@chatgpt-ar.com", link: "https://generator.email/wrightstuff2@chatgpt-ar.com" },
  { email: "daniillysenko@ketua.id", link: "https://generator.email/daniillysenko@ketua.id" },
  { email: "megx13@boranora.com", link: "https://generator.email/megx13@boranora.com" },
  { email: "silovik12@gmaiil.top", link: "https://generator.email/silovik12@gmaiil.top" },
  { email: "bwg38038622@besnetor.com", link: "https://generator.email/bwg38038622@besnetor.com" },
  { email: "luddmilka@happiseektest.com", link: "https://generator.email/luddmilka@happiseektest.com" },
  { email: "ohterp@ahrixthinh.net", link: "https://generator.email/ohterp@ahrixthinh.net" },
  { email: "brianwinton@clonemailgiare.com", link: "https://generator.email/brianwinton@clonemailgiare.com" },
  { email: "dmplpl@googl.win", link: "https://generator.email/dmplpl@googl.win" },
  { email: "whiteguard@btcmod.com", link: "https://generator.email/whiteguard@btcmod.com" },
  { email: "khavaldzy@ppcc.lol", link: "https://generator.email/khavaldzy@ppcc.lol" },
  { email: "snouie@lucktoc.com", link: "https://generator.email/snouie@lucktoc.com" },
  { email: "sjh2035@otpku.com", link: "https://generator.email/sjh2035@otpku.com" },
  { email: "milkshakealex@secretreview.net", link: "https://generator.email/milkshakealex@secretreview.net" }
];

const DEFAULT_PLANS: Plan[] = [
  {
    id: 'monthly',
    name: 'Paket Bulanan',
    price: 10000, // Fallback base price
    duration: 'Bulan',
    features: ['No Watermark', 'All Effects Unlocked', 'Export 4K', 'XML Support'],
    
    hasSharing: true,
    sharingPrice: 5000,
    sharingOriginalPrice: 10000,
    
    hasPrivate: true,
    privatePrice: 15000,
    privateOriginalPrice: 20000,
  },
  {
    id: 'yearly',
    name: 'Paket Tahunan',
    price: 25000, // Fallback base price
    duration: 'Tahun',
    features: ['Hemat 70%', 'No Watermark', 'Priority Support', 'Cloud Storage 50GB', 'XML Support'],
    recommended: true,
    
    hasSharing: true,
    sharingPrice: 20000,
    sharingOriginalPrice: 50000,
    
    hasPrivate: true,
    privatePrice: 50000,
    privateOriginalPrice: 120000,
  },
];

const DEFAULT_ANNOUNCEMENT: Announcement = {
  text: "📢 INFO TERBARU: Metode Pembayaran E-Wallet (DANA/GOPAY/QRIS) Kini Tersedia! Stok Terbatas, Amankan Akunmu Sekarang.",
  isActive: true
};

const App: React.FC = () => {
  // Global State - Plans (Dynamic for Dev Mode)
  const [plans, setPlans] = useState<Plan[]>(() => {
    const storedPlansStr = localStorage.getItem('store_plans');
    if (storedPlansStr) {
      const storedPlans = JSON.parse(storedPlansStr);
      // Ensure 'lifetime' is removed if it exists in old storage
      const hasLifetime = storedPlans.some((p: Plan) => p.id === 'lifetime');
      if (!hasLifetime) {
        return storedPlans;
      }
    }
    return DEFAULT_PLANS;
  });

  // Global State - Stock (Dynamic & Persistent)
  const [stock, setStock] = useState<{email: string, link: string}[]>(() => {
    const saved = localStorage.getItem('app_stock_data');
    return saved ? JSON.parse(saved) : INITIAL_STOCK;
  });

  // Global State - Announcement (Event Running Text)
  const [announcement, setAnnouncement] = useState<Announcement>(() => {
    const stored = localStorage.getItem('store_announcement');
    return stored ? JSON.parse(stored) : DEFAULT_ANNOUNCEMENT;
  });

  // Global State - Developer (Persistent)
  const [developerBalance, setDeveloperBalance] = useState<number>(() => {
    return Number(localStorage.getItem('dev_store_balance')) || 0;
  });
  const [developerTransactions, setDeveloperTransactions] = useState<Transaction[]>(() => {
    const stored = localStorage.getItem('dev_store_transactions');
    return stored ? JSON.parse(stored) : [];
  });
  // Global State - Pending Top Ups (Queue for Admin)
  const [pendingTopUps, setPendingTopUps] = useState<Transaction[]>(() => {
    const stored = localStorage.getItem('admin_pending_topups');
    return stored ? JSON.parse(stored) : [];
  });
  
  // User State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // UI State
  const [showDevDashboard, setShowDevDashboard] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [lastSuccessPurchase, setLastSuccessPurchase] = useState<Transaction | null>(null);

  // --- Plan Management Logic ---
  const handleUpdatePlan = (updatedPlan: Plan) => {
    // This updates the State, which immediately re-renders the App and PlanCards
    const newPlans = plans.map(p => p.id === updatedPlan.id ? updatedPlan : p);
    setPlans(newPlans);
    localStorage.setItem('store_plans', JSON.stringify(newPlans));
  };

  // --- Announcement Logic ---
  const handleUpdateAnnouncement = (newAnn: Announcement) => {
    setAnnouncement(newAnn);
    localStorage.setItem('store_announcement', JSON.stringify(newAnn));
  };

  // --- Stock Management Logic ---
  const handleResetStock = () => {
    if (window.confirm("Apakah Anda yakin ingin me-reset stok kembali ke 30 akun awal?")) {
      setStock(INITIAL_STOCK);
      localStorage.setItem('app_stock_data', JSON.stringify(INITIAL_STOCK));
      alert("✅ Stok berhasil di-reset ke 30 akun.");
    }
  };

  // --- Auth Logic ---
  const handleLogin = (username: string, password?: string) => {
    const cleanUsername = username.trim().toLowerCase(); // Normalize username
    const cleanPassword = password?.trim() || "";

    // 1. STRICT DEVELOPER SECURITY CHECK
    // If someone tries to use the developer username, we check password strictly.
    if (cleanUsername === 'presetbinn.id' || cleanUsername === 'presetbinn.id@gmail.com') {
      if (cleanPassword === 'binnprst1123') {
        const adminUser: User = {
          username: 'presetbinn.id',
          balance: 0, 
          transactions: [],
          role: 'admin'
        };
        setCurrentUser(adminUser);
        setIsAuthOpen(false);
        alert("✅ Verifikasi Berhasil: Selamat datang, Developer!");
        return;
      } else {
        // WRONG PASSWORD FOR DEV ACCOUNT
        alert("⛔ AKSES DITOLAK: Password Developer Salah! \nPercobaan akses ilegal telah dicatat.");
        return; // Stop execution immediately. Do not fall through to user check.
      }
    }

    // 2. Regular User Login
    const existingUserString = localStorage.getItem(`user_${username}`);
    
    if (existingUserString) {
      const user: User = JSON.parse(existingUserString);
      
      // Check Password Match
      if (user.password === cleanPassword) {
        setCurrentUser(user);
        setIsAuthOpen(false);
      } else {
        alert("Password salah. Silakan coba lagi.");
      }
    } else {
      alert("Username tidak ditemukan. Silakan daftar terlebih dahulu.");
    }
  };

  const handleRegister = (username: string, password?: string) => {
    if (localStorage.getItem(`user_${username}`)) {
      alert("Username sudah terpakai. Gunakan username lain.");
      return;
    }
    
    // Prevent registering as the developer username
    const cleanUsername = username.trim().toLowerCase();
    if (cleanUsername === 'presetbinn.id' || cleanUsername === 'presetbinn.id@gmail.com') {
      alert("Username ini dilindungi dan tidak bisa didaftarkan.");
      return;
    }

    if (!password || password.length < 4) {
      alert("Password minimal 4 karakter.");
      return;
    }

    const newUser: User = { 
      username,
      password: password, // Save the password
      balance: 0, 
      transactions: [],
      role: 'user'
    };
    
    localStorage.setItem(`user_${username}`, JSON.stringify(newUser));
    setCurrentUser(newUser);
    setIsAuthOpen(false);
    alert("Pendaftaran berhasil! Anda otomatis login.");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLastSuccessPurchase(null);
    setShowDevDashboard(false);
  };

  const saveUser = (user: User) => {
    if (user.role === 'admin') return; 
    localStorage.setItem(`user_${user.username}`, JSON.stringify(user));
    setCurrentUser(user);
  };

  // --- Transaction Logic ---

  const handleRequestTopUp = (amount: number, method: PaymentMethod) => {
    if (!currentUser) return;
    
    // 1. Create PENDING transaction
    const newTransaction: Transaction = {
      id: `TOP-${Date.now()}`,
      username: currentUser.username, // Important for Admin to know who to credit
      type: 'TOPUP',
      amount: amount,
      timestamp: new Date(),
      status: 'PENDING',
      paymentMethod: method
    };

    // 2. Update User Data (Show pending in history)
    const updatedUser = {
      ...currentUser,
      transactions: [newTransaction, ...currentUser.transactions]
    };
    saveUser(updatedUser);

    // 3. Add to Admin Queue
    const newPendingQueue = [newTransaction, ...pendingTopUps];
    setPendingTopUps(newPendingQueue);
    localStorage.setItem('admin_pending_topups', JSON.stringify(newPendingQueue));
  };

  // --- Admin Logic: Approve Top Up ---
  const handleApproveTopUp = (trx: Transaction) => {
    // 1. Load User Data from Storage
    const userKey = `user_${trx.username}`;
    const userStr = localStorage.getItem(userKey);
    
    if (userStr) {
      const user = JSON.parse(userStr);
      
      // 2. Update User Balance & Transaction Status
      const updatedUser = {
        ...user,
        balance: user.balance + trx.amount,
        transactions: user.transactions.map((t: Transaction) => 
          t.id === trx.id ? { ...t, status: 'SUCCESS' } : t
        )
      };
      
      localStorage.setItem(userKey, JSON.stringify(updatedUser));
      
      // If Admin is somehow viewing the user's view (unlikely), update state
      if (currentUser && currentUser.username === trx.username) {
        setCurrentUser(updatedUser);
      }
    }

    // 3. Remove from Admin Queue
    const newQueue = pendingTopUps.filter(t => t.id !== trx.id);
    setPendingTopUps(newQueue);
    localStorage.setItem('admin_pending_topups', JSON.stringify(newQueue));
    
    alert(`Top Up sebesar Rp ${trx.amount.toLocaleString('id-ID')} untuk ${trx.username} berhasil disetujui.`);
  };

  const handleRejectTopUp = (trxId: string) => {
    // 1. Find transaction to reject
    const trx = pendingTopUps.find(t => t.id === trxId);
    if (trx) {
      // 2. Update User Transaction Status to FAILED
      const userKey = `user_${trx.username}`;
      const userStr = localStorage.getItem(userKey);
      if (userStr) {
        const user = JSON.parse(userStr);
        const updatedUser = {
          ...user,
          transactions: user.transactions.map((t: Transaction) => 
            t.id === trxId ? { ...t, status: 'FAILED' } : t
          )
        };
        localStorage.setItem(userKey, JSON.stringify(updatedUser));
      }
    }

    // 3. Remove from Admin Queue
    const newQueue = pendingTopUps.filter(t => t.id !== trxId);
    setPendingTopUps(newQueue);
    localStorage.setItem('admin_pending_topups', JSON.stringify(newQueue));
  };

  const handlePurchase = async (plan: Plan, selectedType: AccountType) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }

    // Calculate dynamic price based on selection
    const priceToPay = selectedType === 'SHARING' 
      ? (plan.sharingPrice || plan.price) 
      : (plan.privatePrice || plan.price);

    if (currentUser.balance < priceToPay) {
      const need = priceToPay - currentUser.balance;
      const confirmTopUp = window.confirm(`Saldo tidak cukup. Harga: Rp ${priceToPay.toLocaleString('id-ID')}. Kurang: Rp ${need.toLocaleString('id-ID')}. Top Up sekarang?`);
      if (confirmTopUp) setIsTopUpOpen(true);
      return;
    }

    // --- CHECK STOCK AVAILABILITY ---
    if (stock.length === 0) {
      alert("❌ Mohon maaf, stok akun sedang habis. Silakan hubungi admin/developer atau tunggu restock.");
      return;
    }

    // --- PICK AND REMOVE STOCK LOGIC ---
    // 1. Select random account
    const randomIndex = Math.floor(Math.random() * stock.length);
    const selectedAccount = stock[randomIndex];

    // 2. Create new stock list without the selected account
    const newStock = [...stock];
    newStock.splice(randomIndex, 1);
    
    // 3. Update State & LocalStorage (Reduce Stock)
    setStock(newStock);
    localStorage.setItem('app_stock_data', JSON.stringify(newStock));
    
    const now = new Date();
    const credentials: Credentials = {
      email: selectedAccount.email,
      password: "-", // No password needed for these accounts
      accessLink: selectedAccount.link, // Store the generator link
      expiresAt: new Date(now.setMonth(now.getMonth() + 1)).toISOString().split('T')[0]
    };

    const trx: Transaction = {
      id: `TRX-${Date.now()}`,
      username: currentUser.username,
      type: 'PURCHASE',
      planId: plan.id,
      amount: priceToPay,
      timestamp: new Date(),
      status: 'SUCCESS',
      accountType: selectedType, // Save type
      credentials
    };

    // 1. Deduct User Balance
    const updatedUser = {
      ...currentUser,
      balance: currentUser.balance - priceToPay,
      transactions: [trx, ...currentUser.transactions]
    };
    saveUser(updatedUser);

    // 2. Add to Developer Balance (Persistent Revenue)
    const newDevBalance = developerBalance + priceToPay;
    setDeveloperBalance(newDevBalance);
    localStorage.setItem('dev_store_balance', newDevBalance.toString());

    const newDevTrxs = [...developerTransactions, trx];
    setDeveloperTransactions(newDevTrxs);
    localStorage.setItem('dev_store_transactions', JSON.stringify(newDevTrxs));

    // 3. Show Success UI
    setLastSuccessPurchase(trx);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white relative font-sans">
      {/* Navbar */}
      <nav className="fixed w-full z-30 top-0 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-brand-500 to-green-300 bg-clip-text text-transparent">
                binnpreset
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <>
                  <div className="hidden md:flex flex-col items-end mr-2">
                    <span className="text-xs text-gray-400">
                      {currentUser.role === 'admin' ? 'Developer Mode' : `Halo, ${currentUser.username}`}
                    </span>
                    {currentUser.role !== 'admin' && (
                      <span className="font-mono text-brand-500 font-bold">Rp {currentUser.balance.toLocaleString('id-ID')}</span>
                    )}
                  </div>
                  
                  {currentUser.role !== 'admin' && (
                    <button 
                      onClick={() => setIsTopUpOpen(true)}
                      className="bg-brand-600 hover:bg-brand-700 text-white text-xs md:text-sm font-bold px-4 py-2 rounded-full transition-transform hover:scale-105"
                    >
                      + Top Up
                    </button>
                  )}

                  <button 
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className="bg-white text-black text-sm font-bold px-4 py-2 rounded-lg hover:bg-gray-200"
                >
                  Login / Daftar
                </button>
              )}
              
              {/* Only show Dev button if Admin */}
              {currentUser?.role === 'admin' && (
                <button 
                  onClick={() => setShowDevDashboard(true)}
                  className="text-brand-500 hover:text-brand-400 text-xs border border-brand-500 px-2 py-1 rounded font-bold animate-pulse"
                >
                  DASHBOARD
                  {pendingTopUps.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                      {pendingTopUps.length}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Marquee Event Text */}
      {announcement.isActive && (
        <div className="pt-16 pb-0 relative z-20">
          <div className="bg-brand-900/80 border-b border-brand-500/30 overflow-hidden h-8 flex items-center">
            <div className="whitespace-nowrap w-full">
              <span className="animate-marquee text-sm font-mono font-bold text-brand-500">
                 📢 INFO EVENT: {announcement.text} &nbsp;&nbsp;&nbsp; • &nbsp;&nbsp;&nbsp; {announcement.text} &nbsp;&nbsp;&nbsp; • &nbsp;&nbsp;&nbsp;
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`${announcement.isActive ? 'pt-8' : 'pt-24'} pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto`}>
        
        {/* Success Credentials View */}
        {lastSuccessPurchase && lastSuccessPurchase.credentials && (
          <div className="mb-12 bg-gradient-to-b from-green-900/40 to-black border border-brand-500 rounded-3xl p-8 text-center animate-fade-in-down mt-4">
            <div className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(0,210,106,0.5)]">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Pembelian Berhasil!</h2>
            <p className="text-gray-300 mb-6 text-sm">
              Tipe Akun: <span className="font-bold text-brand-500">{lastSuccessPurchase.accountType || 'PREMIUM'}</span>
            </p>
            
            <div className="max-w-md mx-auto bg-gray-900 rounded-xl p-6 border border-gray-700 relative overflow-hidden">
              <div className="mb-4 text-left">
                <label className="text-xs text-gray-500 uppercase tracking-wider">Email Login</label>
                <div className="flex justify-between items-center mt-1">
                  <code className="text-base font-mono text-white select-all">{lastSuccessPurchase.credentials.email}</code>
                  <button onClick={() => navigator.clipboard.writeText(lastSuccessPurchase.credentials?.email || "")} className="text-brand-500 text-xs">Copy</button>
                </div>
              </div>
              
              {/* Conditional Display: Link or Password */}
              {lastSuccessPurchase.credentials.accessLink ? (
                <div className="text-left border-t border-gray-800 pt-4">
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Akses Masuk</label>
                  <div className="mt-2">
                    <p className="text-xs text-yellow-500 mb-2">⚠ Akun ini tidak menggunakan password. Klik link di bawah untuk melihat kode login:</p>
                    <a 
                      href={lastSuccessPurchase.credentials.accessLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full bg-brand-600 hover:bg-brand-500 text-white text-center font-bold py-3 rounded-lg transition-colors"
                    >
                      Buka Inbox / Link Akses ➔
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-left border-t border-gray-800 pt-4">
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Password</label>
                  <div className="flex justify-between items-center mt-1">
                     <code className="text-base font-mono text-white select-all">{lastSuccessPurchase.credentials.password}</code>
                     <button onClick={() => navigator.clipboard.writeText(lastSuccessPurchase.credentials?.password || "")} className="text-brand-500 text-xs">Copy</button>
                  </div>
                </div>
              )}
            </div>
            <button 
              onClick={() => setLastSuccessPurchase(null)}
              className="mt-6 text-gray-400 hover:text-white text-sm underline"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Hero & Info */}
        {!lastSuccessPurchase && (
          <div className="text-center mb-12 mt-4">
            {!currentUser && (
               <div className="inline-block bg-brand-900/50 text-brand-500 px-4 py-1 rounded-full text-xs font-bold mb-4 border border-brand-500/20">
                 🎉 Login untuk mulai belanja
               </div>
            )}
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-2">
              <span className="text-brand-500">binnpreset</span> Store
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto mb-4">
              Sistem dompet digital. Isi saldo, beli paket, dan terima akun dalam hitungan detik. 
              {currentUser && currentUser.role !== 'admin' && (
                <span className="block mt-2 text-white font-medium">
                  Saldo Anda: Rp {currentUser.balance.toLocaleString('id-ID')}
                </span>
              )}
            </p>

            {/* STOCK INDICATOR FOR USERS */}
            <div className="inline-flex items-center space-x-2 bg-gray-900 border border-gray-700 px-4 py-2 rounded-full">
              <div className={`w-3 h-3 rounded-full ${stock.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-bold ${stock.length > 0 ? 'text-white' : 'text-red-500'}`}>
                {stock.length > 0 ? `Stok Tersedia: ${stock.length} Akun` : 'STOK HABIS'}
              </span>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div id="pricing" className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <PlanCard 
              key={plan.id} 
              plan={plan} 
              isLoading={false}
              stockCount={stock.length} // Pass stock count to card
              onSelect={handlePurchase} 
            />
          ))}
        </div>
      </main>

      {/* Modals */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onLogin={handleLogin} 
        onRegister={handleRegister} 
      />
      
      <TopUpModal 
        isOpen={isTopUpOpen} 
        onClose={() => setIsTopUpOpen(false)} 
        onSubmitRequest={handleRequestTopUp} 
      />

      {showDevDashboard && currentUser?.role === 'admin' && (
        <DeveloperDashboard 
          balance={developerBalance} 
          transactions={developerTransactions}
          pendingTopUps={pendingTopUps}
          plans={plans}
          announcement={announcement}
          stockCount={stock.length}
          onUpdateAnnouncement={handleUpdateAnnouncement}
          onUpdatePlan={handleUpdatePlan}
          onApproveTopUp={handleApproveTopUp}
          onRejectTopUp={handleRejectTopUp}
          onResetStock={handleResetStock}
          onClose={() => setShowDevDashboard(false)} 
        />
      )}
      
      <ChatWidget />
    </div>
  );
};

export default App;