import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  RefreshCw, Droplet, AlertTriangle, CheckCircle2, 
  Wrench, Plus, Minus, CreditCard, Bell, Megaphone, Clock, 
  FileText, ArrowRight, ShieldCheck, UserCheck, Package, Receipt, IndianRupee 
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import useUiStore from '../store/uiStore';
import { useDashboard } from '../hooks/useDashboard';
import OfflineIndicator from '../components/shared/OfflineIndicator';
import LanguageSelector from '../components/shared/LanguageSelector';
import StatusBadge from '../components/shared/StatusBadge';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { isOnline } = useUiStore();
  const { stats, isLoading, isError, refetch } = useDashboard();

  const isCitizenUser = user?.role === 'user';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.greeting_morning', 'Good morning');
    if (hour < 18) return t('dashboard.greeting_afternoon', 'Good afternoon');
    return t('dashboard.greeting_evening', 'Good evening');
  };

  const formatCurrency = (amount) => {
    return amount?.toLocaleString('en-IN') || '0';
  };

  // ─────────────────────────────────────────────────────────────
  // CITIZEN / USER DASHBOARD VIEW (Raise Complaint + GP Alerts)
  // ─────────────────────────────────────────────────────────────
  const renderUserDashboard = () => {
    return (
      <div className="px-4 pt-4 space-y-5 pb-8 animate-fade-in">
        {/* Primary Action Hero Card: Raise Complaint */}
        <div className="bg-hero-gradient text-white rounded-3xl p-6 shadow-float relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold text-jal-100 backdrop-blur-md">
              <Megaphone className="w-3.5 h-3.5 text-warn-300" />
              <span>Village Water Citizen Portal</span>
            </div>
            
            <h2 className="text-2xl font-black leading-tight text-white">
              Have a water supply or pipeline issue?
            </h2>
            
            <p className="text-xs text-jal-100 font-medium leading-relaxed">
              Report low pressure, pipe leakage, dirty water, or tap damage directly to Koregaon Gram Panchayat.
            </p>

            <button
              onClick={() => navigate('/maintenance/new')}
              className="w-full mt-2 bg-white text-primary-700 py-3.5 rounded-2xl font-extrabold text-sm shadow-card-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2 tap-highlight cursor-pointer"
            >
              <Wrench className="w-4 h-4 text-primary-600" />
              <span>Raise Complaint / Report Water Issue</span>
            </button>
          </div>
        </div>

        {/* GP Water Supply Broadcast Alerts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-primary-500" />
              <span>Gram Panchayat Water Alerts</span>
            </div>
            <span className="text-[10px] font-bold bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">
              Live Updates
            </span>
          </div>

          <div className="space-y-3">
            {/* Alert 1: Timings */}
            <div className="bg-white rounded-2xl p-4 shadow-card border-l-4 border-primary-500 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary-700 uppercase flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-primary-500" />
                  Daily Water Supply Timings
                </span>
                <span className="text-[10px] font-semibold text-slate-400">Today</span>
              </div>
              <p className="text-sm font-bold text-slate-800">
                Morning: 6:30 AM – 9:00 AM • Evening: 5:30 PM – 7:30 PM
              </p>
              <p className="text-xs text-slate-500">
                Normal water pressure available across all Wards 1, 2, and 3.
              </p>
            </div>

            {/* Alert 2: Tank Cleaning Notice */}
            <div className="bg-white rounded-2xl p-4 shadow-card border-l-4 border-warn-500 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-warn-700 uppercase flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-warn-500" />
                  Scheduled Tank Maintenance Notice
                </span>
                <span className="text-[10px] font-semibold text-slate-400">Friday</span>
              </div>
              <p className="text-sm font-bold text-slate-800">
                Koregaon Overhead Tank Cleaning (10 AM to 2 PM)
              </p>
              <p className="text-xs text-slate-500">
                Water supply will be paused for 4 hours. Please store drinking water in advance.
              </p>
            </div>
          </div>
        </div>

        {/* My Household Connection & Water Bill */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-slate-100 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">My Household Tap Connection</span>
              <h3 className="text-base font-extrabold text-slate-900">{user?.name || 'Ramesh Patil'}</h3>
              <p className="text-xs text-slate-500 font-medium">CON-0001 • Ward 1, Koregaon</p>
            </div>
            <StatusBadge status="active" />
          </div>

          <div className="p-4 bg-surf-1 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 block">August 2026 Water Bill</span>
              <div className="text-2xl font-black text-primary-700">₹100</div>
              <span className="text-[10px] font-semibold text-slate-500">Due Date: 31 Aug 2026</span>
            </div>
            <button
              onClick={() => navigate('/payments?bill=BILL-AUG26-001')}
              className="px-4 py-2.5 bg-primary-500 text-white rounded-xl font-bold text-xs shadow-md active:scale-95 transition-transform flex items-center gap-1.5 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay Bill Online</span>
            </button>
          </div>
        </div>

        {/* My Complaints Status Tracker */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
              My Complaints & Status
            </div>
            <button
              onClick={() => navigate('/maintenance')}
              className="text-xs font-bold text-primary-600 hover:text-primary-700 cursor-pointer"
            >
              View All →
            </button>
          </div>

          <div className="space-y-2.5">
            {[
              {
                id: 'TKT-104',
                issue: 'Low water pressure at kitchen tap',
                date: 'Yesterday',
                status: 'reported',
                location: 'Ward 1, House #42'
              },
              {
                id: 'TKT-098',
                issue: 'Minor pipeline leakage near entrance gate',
                date: '16 Aug 2026',
                status: 'in_progress',
                location: 'Ward 1 Main Line'
              },
              {
                id: 'TKT-085',
                issue: 'Tap valve replacement',
                date: '10 Aug 2026',
                status: 'completed',
                location: 'Ward 1 Tap Connection'
              }
            ].map((complaint) => (
              <div
                key={complaint.id}
                onClick={() => navigate('/maintenance')}
                className="bg-white rounded-2xl p-4 shadow-card border border-slate-100/80 flex items-center justify-between tap-highlight card-press cursor-pointer"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">
                      {complaint.id}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">{complaint.date}</span>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-800">{complaint.issue}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{complaint.location}</p>
                </div>
                <StatusBadge status={complaint.status} size="xs" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────
  // ADMIN / OFFICIAL DASHBOARD VIEW (Full Premium SaaS Metrics Grid)
  // ─────────────────────────────────────────────────────────────
  const renderAdminDashboard = () => {
    if (isLoading) {
      return (
        <div className="px-4 pt-4 space-y-5">
          <div className="h-48 bg-slate-200 animate-shimmer rounded-3xl"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-32 bg-slate-200 animate-shimmer rounded-2xl"></div>
            <div className="h-32 bg-slate-200 animate-shimmer rounded-2xl"></div>
          </div>
        </div>
      );
    }

    if (isError || !stats) {
      return (
        <div className="px-4 pt-4">
          <div 
            className="bg-white rounded-2xl shadow-card p-6 text-center card-press cursor-pointer"
            onClick={() => refetch()}
          >
            <AlertTriangle className="w-10 h-10 text-warn-500 mx-auto mb-3" />
            <p className="text-lg font-bold text-slate-800">{t('common.error')}</p>
            <p className="text-slate-500 mt-1">{t('dashboard.retry')}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="px-4 pt-4 space-y-5 pb-8">
        {/* Hero Water Network Card */}
        <div 
          className="relative bg-hero-gradient text-white rounded-3xl p-6 shadow-float overflow-hidden card-press cursor-pointer transition-transform"
          onClick={() => navigate('/map')}
        >
          <div className="relative z-10 flex flex-col h-full space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-jal-100 text-xs font-black uppercase tracking-widest">
                Water Network
              </span>
              <span className="text-jal-100 text-xs font-bold flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                View Network →
              </span>
            </div>
            
            <div>
              <div className="text-5xl font-black text-white leading-none">
                {stats.assets?.total || 12}
              </div>
              <div className="text-xs font-bold text-white/80 mt-1 tracking-wider uppercase">
                Total Registered Assets
              </div>
            </div>

            {/* Pill-shaped status badges */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/20">
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-ok-500"></div>
                <span>{stats.assets?.operational || 9} Operational</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-warn-500"></div>
                <span>{stats.assets?.needs_attention || 2} Attention</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span>{stats.assets?.under_maintenance || 1} Maint</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2x2 Metrics Grid */}
        <div>
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">
            System Metrics Overview
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* Metric 1: Maintenance */}
            <div 
              onClick={() => navigate('/maintenance')}
              className="bg-white rounded-2xl p-4 shadow-card border border-slate-100 flex flex-col justify-between tap-highlight card-press cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Wrench className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  Action Required
                </span>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{stats.maintenance?.open || 3}</div>
                <div className="text-xs font-bold text-slate-500 mt-0.5">Maintenance Tasks</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-1">3 open issues requiring repair</div>
              </div>
            </div>

            {/* Metric 2: Inventory */}
            <div 
              onClick={() => navigate('/inventory')}
              className="bg-white rounded-2xl p-4 shadow-card border border-slate-100 flex flex-col justify-between tap-highlight card-press cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                  Low Stock
                </span>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{stats.inventory?.low_stock || 2}</div>
                <div className="text-xs font-bold text-slate-500 mt-0.5">Inventory Stock</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-1">2 chemical items low level</div>
              </div>
            </div>

            {/* Metric 3: Finance */}
            <div 
              onClick={() => navigate('/finance')}
              className="bg-white rounded-2xl p-4 shadow-card border border-slate-100 flex flex-col justify-between tap-highlight card-press cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Healthy
                </span>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">₹{formatCurrency(stats.finance?.balance || 26500)}</div>
                <div className="text-xs font-bold text-slate-500 mt-0.5">Available Balance</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-1">Net GP water account fund</div>
              </div>
            </div>

            {/* Metric 4: Bills */}
            <div 
              onClick={() => navigate('/billing')}
              className="bg-white rounded-2xl p-4 shadow-card border border-slate-100 flex flex-col justify-between tap-highlight card-press cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  Pending
                </span>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{stats.bills?.pending || 5}</div>
                <div className="text-xs font-bold text-slate-500 mt-0.5">Water Tariff Bills</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-1">5 pending household bills</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Row with Light-Blue Circular Backgrounds */}
        <div>
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Quick Actions</div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {[
              { icon: Plus, label: 'Add Asset', to: '/assets?action=add' },
              { icon: Wrench, label: 'Report Issue', to: '/maintenance/new' },
              { icon: Package, label: 'Add Stock', to: '/inventory' },
              { icon: Minus, label: 'Expense', to: '/finance' },
              { icon: IndianRupee, label: 'Receipt', to: '/finance' },
              { icon: FileText, label: 'Generate Bill', to: '/billing' },
            ].map((action, idx) => (
              <div 
                key={idx}
                onClick={() => navigate(action.to)}
                className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl shadow-card min-w-[80px] text-center tap-highlight card-press cursor-pointer border border-slate-100/80"
              >
                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold text-slate-700 leading-tight">{action.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Needs Attention Alert List */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Needs Attention</div>
            <div className="bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
              {(stats.maintenance?.open || 3) + (stats.inventory?.low_stock || 2)} Alerts
            </div>
          </div>
          
          <div className="space-y-3">
            {/* Open Issues Alert (Pale Amber Background) */}
            <div 
              className="bg-amber-50/90 rounded-2xl shadow-sm p-4 border-l-4 border-amber-500 flex items-center gap-4 tap-highlight card-press cursor-pointer text-amber-950"
              onClick={() => navigate('/maintenance')}
            >
              <div className="w-10 h-10 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-extrabold text-amber-950">{stats.maintenance?.open || 3} Open Maintenance Tickets</h4>
                <p className="text-xs text-amber-800 font-medium mt-0.5">Motor overheating & valve joint leakage reported</p>
              </div>
              <div className="text-primary-600 text-xs font-extrabold shrink-0">View →</div>
            </div>
            
            {/* Low Stock Alert (Pale Red Background) */}
            <div 
              className="bg-red-50/90 rounded-2xl shadow-sm p-4 border-l-4 border-red-500 flex items-center gap-4 tap-highlight card-press cursor-pointer text-red-950"
              onClick={() => navigate('/inventory')}
            >
              <div className="w-10 h-10 rounded-full bg-red-200 text-red-800 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-extrabold text-red-950">{stats.inventory?.low_stock || 2} Low Inventory Items</h4>
                <p className="text-xs text-red-800 font-medium mt-0.5">Gate Valve 4" & Bleaching Powder below safety level</p>
              </div>
              <div className="text-primary-600 text-xs font-extrabold shrink-0">View →</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page-enter pb-24 min-h-screen bg-surf-1">
      {/* Sticky Header with EN/HI/MR Toggle */}
      <header className="sticky top-0 z-10 glass border-b border-white/20 px-4 py-3 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-extrabold text-slate-800">
            {getGreeting()}
          </h1>
          <p className="text-xs text-slate-500 font-bold mt-0.5">
            {isCitizenUser ? 'Citizen Water Portal' : 'GP Administrator'} · Koregaon GP
          </p>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector variant="header" />
          <OfflineIndicator />
          <button 
            onClick={() => refetch()} 
            className="p-2 bg-white/80 rounded-full shadow-xs text-primary-500 active:scale-95 transition-transform cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>
      
      {!isOnline && (
        <div className="mx-4 mt-4 bg-warn-100 text-warn-800 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          {t('dashboard.offline_banner')}
        </div>
      )}

      {isCitizenUser ? renderUserDashboard() : renderAdminDashboard()}
    </div>
  );
};

export default Dashboard;
