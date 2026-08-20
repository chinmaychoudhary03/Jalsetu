import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Package, Search, Plus, Minus, AlertTriangle, 
  RefreshCw, ShieldAlert
} from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import StockBar from '../components/shared/StockBar';
import StatusBadge from '../components/shared/StatusBadge';
import Toast from '../components/shared/Toast';
import SkeletonPage, { SkeletonCard } from '../components/ui/SkeletonCard';
import EmptyState from '../components/ui/EmptyState';
import ActionChip from '../components/ui/ActionChip';
import Badge from '../components/ui/Badge';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'chemical': return '🧪';
    case 'filter': return '🧱';
    case 'spare_part': return '⚙️';
    case 'supply': return '⛽';
    default: return '📦';
  }
};

const Inventory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [activeModalItem, setActiveModalItem] = useState(null);
  const [transType, setTransType] = useState('in'); 
  const [transQty, setTransQty] = useState('');
  const [transRemarks, setTransRemarks] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const { items, isLoading, isError, refetch, recordTransaction, isRecording } = useInventory();

  const categories = [
    { id: 'all', label: t('inventory.cat_all', 'All Categories') },
    { id: 'chemical', label: t('inventory.cat_chemical', 'Chemicals') },
    { id: 'filter', label: t('inventory.cat_filter', 'Filters') },
    { id: 'spare_part', label: t('inventory.cat_spare_part', 'Spare Parts') },
    { id: 'supply', label: t('inventory.cat_supply', 'Supplies') }
  ];

  const statuses = [
    { id: 'all', label: t('inventory.status_all', 'All Status') },
    { id: 'healthy', label: t('status.healthy', 'Healthy') },
    { id: 'low_stock', label: t('status.low_stock', 'Low Stock') },
    { id: 'replenishment_required', label: t('status.replenishment_required', 'Replenish Soon') }
  ];

  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    let matchesStatus = true;
    if (selectedStatus === 'healthy') matchesStatus = item.status === 'healthy';
    else if (selectedStatus === 'low_stock') matchesStatus = item.status === 'low_stock';
    else if (selectedStatus === 'replenishment_required') matchesStatus = item.status === 'replenishment_required';

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const lowStockCount = items.filter(i => i.status === 'low_stock').length;
  const replenishCount = items.filter(i => i.status === 'replenishment_required').length;

  const handleOpenModal = (e, item, type) => {
    e.stopPropagation();
    setActiveModalItem(item);
    setTransType(type);
    setTransQty('');
    setTransRemarks('');
  };

  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    if (!transQty || Number(transQty) <= 0) return;

    try {
      await recordTransaction({
        itemId: activeModalItem.id,
        type: transType,
        quantity: transQty,
        remarks: transRemarks || (transType === 'in' ? 'Stock Added' : 'Recorded Consumption')
      });

      setToastMessage({
        type: 'success',
        text: `Stock ${transType === 'in' ? 'added' : 'deducted'} successfully for ${activeModalItem.name}`
      });

      setActiveModalItem(null);
    } catch (err) {
      setToastMessage({
        type: 'error',
        text: 'Failed to record stock transaction'
      });
    }
  };

  return (
    <div className="pb-24 bg-slate-50 min-h-screen">
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.text}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Header (sticky glass) */}
      <div className="sticky top-0 z-10 glass border-b border-white/20 px-4 py-3 bg-white/80 backdrop-blur-md">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{t('nav.inventory', 'Inventory')}</h1>
            <p className="text-xs font-bold text-slate-500">
              {items.length} items
            </p>
          </div>
          <button 
            onClick={() => refetch()} 
            className="p-2.5 bg-white rounded-full shadow-sm text-slate-600 active:scale-95 transition-transform border border-slate-200"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search inventory..."
            className="w-full bg-white/80 text-slate-800 placeholder-slate-400 pl-11 pr-4 py-3 rounded-2xl shadow-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium"
          />
        </div>
      </div>

      <div className="px-4 pt-3">
        {/* Low Stock Warning */}
        {(lowStockCount > 0 || replenishCount > 0) && (
          <div className="mb-4 p-3 bg-warn-50 border border-warn-200 rounded-2xl flex items-center justify-between text-warn-900">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-warn-600 shrink-0" />
              <div>
                <span className="font-bold text-sm">{lowStockCount + replenishCount} Items Need Attention</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedStatus('replenishment_required')}
              className="px-3 py-1 bg-warn-600 text-white rounded-full font-bold text-[11px]"
            >
              View Low
            </button>
          </div>
        )}

        {/* Category & Status Filters */}
        <div className="space-y-3 mb-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <ActionChip
                key={cat.id}
                label={cat.label}
                active={selectedCategory === cat.id}
                onClick={() => setSelectedCategory(cat.id)}
              />
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {statuses.map((st) => (
              <ActionChip
                key={st.id}
                label={st.label}
                active={selectedStatus === st.id}
                onClick={() => setSelectedStatus(st.id)}
              />
            ))}
          </div>
        </div>

        {/* Item List */}
        {isLoading ? (
          <SkeletonPage cards={5} />
        ) : isError ? (
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-100">
            <AlertTriangle className="w-10 h-10 text-warn-500 mx-auto mb-2" />
            <p className="text-base font-bold text-slate-800">An error occurred</p>
            <button onClick={() => refetch()} className="mt-3 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-semibold">
              Tap to retry
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <EmptyState 
            type="inventory" 
            title="No Items" 
            description="No inventory items found matching your filters." 
          />
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => {
              let statusBorder = 'border-slate-100/80';
              if (item.status === 'healthy') statusBorder = 'border-ok-500';
              if (item.status === 'low_stock') statusBorder = 'border-warn-500';
              if (item.status === 'replenishment_required') statusBorder = 'border-crit-500';

              return (
                <div
                  key={item.id}
                  onClick={() => navigate(`/inventory/${item.id}`)}
                  className={`bg-white rounded-2xl shadow-card border-y border-r border-l-4 p-4 tap-highlight cursor-pointer ${statusBorder}`}
                >
                  {/* Row 1: Item name + badges */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 line-clamp-1">{item.name}</h3>
                    <div className="flex gap-1 shrink-0">
                      <Badge variant="outline" className="capitalize text-[10px]">{item.category?.replace('_', ' ')}</Badge>
                      <StatusBadge status={item.status} size="sm" />
                    </div>
                  </div>

                  {/* Row 2: Stock number */}
                  <div className="mb-3 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">{item.quantity}</span>
                    <span className="text-sm font-bold text-slate-500">{item.unit}</span>
                  </div>

                  {/* Row 3: StockBar */}
                  <div className="mb-3">
                    <StockBar quantity={item.quantity} minQuantity={item.min_quantity} unit={item.unit} />
                  </div>

                  {/* Row 4: Min + Action */}
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100">
                    <span className="text-xs font-medium text-slate-500">Minimum: {item.min_quantity} {item.unit}</span>
                    <button
                      onClick={(e) => handleOpenModal(e, item, 'in')}
                      className="bg-primary-50 text-primary-700 px-3 py-1.5 rounded-xl text-xs font-bold active:scale-95"
                    >
                      + Stock In
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal for Quick Stock In / Stock Out */}
      {activeModalItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-md shadow-2xl space-y-4 animate-slide-up">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getCategoryIcon(activeModalItem.category)}</span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {transType === 'in' ? '+ Add Stock' : '- Record Consumption'}
                  </h3>
                  <p className="text-xs text-slate-500">{activeModalItem.name}</p>
                </div>
              </div>
              <button onClick={() => setActiveModalItem(null)} className="text-slate-400 font-bold p-1">✕</button>
            </div>

            <form onSubmit={handleSaveTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Quantity ({activeModalItem.unit}) *</label>
                <input
                  type="number"
                  step="any"
                  min="0.1"
                  required
                  value={transQty}
                  onChange={(e) => setTransQty(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-lg font-bold text-slate-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Remarks (Optional)</label>
                <input
                  type="text"
                  value={transRemarks}
                  onChange={(e) => setTransRemarks(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setActiveModalItem(null)} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold">Cancel</button>
                <button type="submit" disabled={isRecording} className={`flex-1 py-3 text-white rounded-xl text-sm font-bold shadow-md ${transType === 'in' ? 'bg-ok-600' : 'bg-primary-600'}`}>
                  {isRecording ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
