import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { useBilling } from '../hooks/useBilling';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const BillDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { billDetail, isLoading, isError } = useBilling('all', id);

  if (isLoading) return <LoadingSpinner />;
  if (isError || !billDetail) return <div className="p-4 text-center">Error loading bill</div>;

  const consumer = billDetail.consumer || { id: billDetail.consumer_id, name: 'Ramesh Patil', address: 'Koregaon' };

  return (
    <div className="pb-28 bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10 flex items-center justify-between shadow-sm">
        <button onClick={() => navigate('/billing')} className="p-2 rounded-full bg-slate-100"><ArrowLeft className="w-5 h-5"/></button>
        <h1 className="text-lg font-bold">Water Bill</h1>
        <button onClick={() => window.print()} className="p-2"><Printer className="w-5 h-5"/></button>
      </div>

      <div className="p-4">
        {/* Receipt Card */}
        <div className="bg-white rounded-3xl shadow-float overflow-hidden border border-slate-100">
          <div className="bg-teal-600 text-white p-4 text-center">
            <h2 className="font-black text-xl tracking-wide">JALSETU JJM</h2>
            <p className="text-xs opacity-80">Official Water Tax Invoice</p>
          </div>
          
          <div className="p-5">
            <div className="bg-slate-50 p-4 rounded-2xl mb-5 space-y-2 text-sm font-medium">
              <div className="flex justify-between"><span className="text-slate-500">Bill ID</span><span className="font-bold font-mono">#{billDetail.id}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Period</span><span className="font-bold">{billDetail.billing_period}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Consumer</span><span className="font-bold text-right">{consumer.name}<br/><span className="text-xs text-slate-400">{consumer.id}</span></span></div>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm"><span className="text-slate-600">Fixed Tariff</span><span className="font-bold">₹{billDetail.amount}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-600">Arrears</span><span className="font-bold">₹0</span></div>
            </div>

            <div className="border-t-2 border-dashed border-slate-200 pt-4 pb-2 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-500">AMOUNT DUE</span>
              <span className="text-3xl font-black text-primary-600">₹{billDetail.amount}</span>
            </div>
            <div className="text-right text-xs font-bold text-slate-400">
              Due Date: {billDetail.due_date}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-100 z-20">
        {billDetail.status !== 'paid' ? (
          <button onClick={() => navigate(`/payments?bill=${billDetail.id}`)} className="w-full bg-primary-500 text-white py-4 rounded-full font-black text-lg shadow-float active:scale-95 transition-transform">
            PAY NOW
          </button>
        ) : (
          <div className="w-full py-4 bg-ok-100 text-ok-700 rounded-full font-black text-center">
            PAID IN FULL
          </div>
        )}
      </div>
    </div>
  );
};

export default BillDetail;
