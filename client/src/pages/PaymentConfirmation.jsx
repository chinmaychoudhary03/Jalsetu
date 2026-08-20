import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Printer, Home, FileText } from 'lucide-react';

const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state || { transaction_id: 'TXN-001', amount: 100, payment_mode: 'UPI', date: new Date().toISOString(), bill: { consumer_id: 'CON-001', billing_period: 'Aug 2026' }};

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
      <div className="w-24 h-24 bg-ok-100 rounded-full flex items-center justify-center mb-6 animate-bounce-in shadow-lg">
        <CheckCircle2 className="w-12 h-12 text-ok-600" />
      </div>
      
      <h1 className="text-2xl font-black text-slate-900 mb-2">Payment Successful!</h1>
      <div className="text-4xl font-black text-ok-600 mb-8">₹{data.amount}</div>

      <div className="bg-white w-full max-w-md rounded-3xl shadow-card-lg border border-slate-100 overflow-hidden mb-8">
        <div className="bg-bg-jal-gradient py-3 text-center text-white font-black tracking-widest text-xs uppercase">
          OFFICIAL PAYMENT RECEIPT
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 p-3 rounded-xl font-mono text-center text-sm font-bold text-slate-700">
            {data.transaction_id}
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Consumer</span><span className="font-bold">{data.bill.consumer_id}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Period</span><span className="font-bold">{data.bill.billing_period}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Mode</span><span className="font-bold uppercase">{data.payment_mode}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Date</span><span className="font-bold">{new Date(data.date).toLocaleDateString()}</span></div>
          </div>
          <div className="mt-4 p-4 bg-ok-50 rounded-2xl flex justify-between items-center border border-ok-100">
            <span className="font-bold text-ok-800 text-sm">Total Paid</span>
            <span className="font-black text-ok-600 text-xl">₹{data.amount}</span>
          </div>
          <div className="text-center text-[10px] text-slate-400 font-bold uppercase mt-2">
            🛡 Digitally Verified by Koregaon Gram Panchayat
          </div>
        </div>
      </div>

      <div className="w-full max-w-md space-y-3">
        <button onClick={() => window.print()} className="w-full py-4 rounded-full font-bold bg-slate-900 text-white flex items-center justify-center gap-2 active:scale-95">
          <Printer className="w-5 h-5"/> Print Receipt
        </button>
        <button onClick={() => navigate('/billing')} className="w-full py-4 rounded-full font-bold bg-slate-200 text-slate-800 flex items-center justify-center gap-2 active:scale-95">
          <FileText className="w-5 h-5"/> Back to Billing
        </button>
        <button onClick={() => navigate('/dashboard')} className="w-full py-4 rounded-full font-bold text-primary-600 flex items-center justify-center gap-2 active:scale-95">
          <Home className="w-5 h-5"/> Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
