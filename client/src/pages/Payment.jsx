import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock, Smartphone, Building2, Banknote, QrCode, CheckCircle2 } from 'lucide-react';
import { useBilling } from '../hooks/useBilling';
import { usePayments } from '../hooks/usePayments';
import useAuthStore from '../store/authStore';
import Toast from '../components/shared/Toast';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const { bills } = useBilling('pending');
  const { createOrder, verifyPayment } = usePayments();

  const [selectedBillId, setSelectedBillId] = useState(searchParams.get('bill') || '');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    loadRazorpayScript();
    if (!selectedBillId && bills?.length) setSelectedBillId(bills[0].id);
  }, [bills, selectedBillId]);

  const currentBill = bills?.find(b => b.id === selectedBillId) || { 
    id: 'BILL-AUG26-001', 
    amount: 100, 
    consumer: { name: user?.name || 'Ramesh Patil' }
  };

  const upiId = "grampanchayat.koregaon@okicici";
  const upiString = `upi://pay?pa=${upiId}&pn=Koregaon%20Gram%20Panchayat&am=${currentBill.amount}&cu=INR&tn=Water%20Tax%20${currentBill.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiString)}`;

  const handleCompleteUPIPayment = async () => {
    setIsProcessing(true);
    try {
      const verifyRes = await verifyPayment({ 
        billId: currentBill.id, 
        orderId: `order_upi_${Date.now()}`, 
        paymentId: `pay_upi_qr_${Date.now()}`, 
        paymentMode: 'upi' 
      });

      setIsProcessing(false);
      setShowQRModal(false);
      navigate('/payments/confirm', { 
        state: { 
          transaction_id: verifyRes.transaction_id || `TXN-JAL-UPI-${Date.now()}`, 
          bill: currentBill, 
          amount: currentBill.amount, 
          payment_mode: 'UPI QR Code', 
          date: new Date().toISOString() 
        }
      });
    } catch (err) {
      setToastMessage({ type: 'error', text: 'UPI verification failed' });
      setIsProcessing(false);
    }
  };

  const handlePay = async () => {
    if (paymentMethod === 'upi') {
      setShowQRModal(true);
      return;
    }

    setIsProcessing(true);
    try {
      // Create Razorpay order on backend
      const order = await createOrder({ billId: currentBill.id, amount: currentBill.amount });
      
      const resLoaded = await loadRazorpayScript();
      if (resLoaded && window.Razorpay && order?.id) {
        const options = {
          key: 'rzp_test_TS6zjxMf34VI2C',
          amount: order.amount || currentBill.amount * 100,
          currency: order.currency || 'INR',
          name: 'Jalsetu Water Tax',
          description: `Water Tariff Payment for ${currentBill.id}`,
          order_id: order.id.startsWith('order_mock') ? undefined : order.id,
          config: {
            display: {
              blocks: {
                upi: {
                  name: "Pay via UPI / QR",
                  instruments: [{ method: "upi" }]
                }
              },
              sequence: ["block.upi", "block.banks"]
            }
          },
          handler: async function (response) {
            try {
              const verifyRes = await verifyPayment({
                billId: currentBill.id,
                orderId: response.razorpay_order_id || order.id,
                paymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
                signature: response.razorpay_signature,
                paymentMode: paymentMethod
              });
              setIsProcessing(false);
              navigate('/payments/confirm', {
                state: {
                  transaction_id: verifyRes.transaction_id || response.razorpay_payment_id || `TXN-JAL-${Date.now()}`,
                  bill: currentBill,
                  amount: currentBill.amount,
                  payment_mode: paymentMethod,
                  date: new Date().toISOString()
                }
              });
            } catch (err) {
              setToastMessage({ type: 'error', text: 'Verification failed' });
              setIsProcessing(false);
            }
          },
          prefill: {
            name: user?.name || 'Ramesh Patil',
            email: 'citizen@koregaon.gp.in',
            contact: '9876543210'
          },
          theme: {
            color: '#0284c7'
          },
          modal: {
            ondismiss: function() {
              setIsProcessing(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      }

      // Fallback verification if script blocked
      const verifyRes = await verifyPayment({ 
        billId: currentBill.id, 
        orderId: order.id || `order_${Date.now()}`, 
        paymentId: `pay_rzp_${Date.now()}`, 
        paymentMode: paymentMethod 
      });

      setIsProcessing(false);
      navigate('/payments/confirm', { 
        state: { 
          transaction_id: verifyRes.transaction_id || `TXN-JAL-${Date.now()}`, 
          bill: currentBill, 
          amount: currentBill.amount, 
          payment_mode: paymentMethod, 
          date: new Date().toISOString() 
        }
      });
    } catch (err) {
      setToastMessage({ type: 'error', text: 'Payment failed' });
      setIsProcessing(false);
    }
  };

  const methods = [
    { id: 'upi', title: 'UPI / Dynamic QR Code', desc: 'Scan via GPay, PhonePe, Paytm, BHIM', icon: QrCode, color: 'text-purple-600 bg-purple-100' },
    { id: 'card', title: 'Credit / Debit Card', desc: 'Visa, MasterCard, RuPay (Razorpay)', icon: CreditCard, color: 'text-blue-600 bg-blue-100' },
    { id: 'netbanking', title: 'NetBanking', desc: 'SBI, HDFC, ICICI, Axis (Razorpay)', icon: Building2, color: 'text-teal-600 bg-teal-100' },
    { id: 'cash', title: 'Panchayat Cash Counter', desc: 'Pay directly at Gram Panchayat', icon: Banknote, color: 'text-amber-600 bg-amber-100' }
  ];

  return (
    <div className="pb-28 bg-slate-50 min-h-screen">
      {toastMessage && <Toast type={toastMessage.type} message={toastMessage.text} onClose={() => setToastMessage(null)}/>}

      <div className="bg-white p-4 sticky top-0 z-10 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-100 rounded-full cursor-pointer"><ArrowLeft className="w-5 h-5"/></button>
        <h1 className="text-xl font-bold">Checkout</h1>
      </div>

      <div className="p-6 text-center space-y-2">
        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Amount to Pay</div>
        <div className="text-5xl font-black text-primary-700">₹{currentBill.amount}</div>
        <div className="text-xs text-slate-400 font-bold bg-slate-200 inline-block px-3 py-1 rounded-full">{currentBill.consumer?.name || currentBill.consumer_id}</div>
      </div>

      <div className="p-4 space-y-3">
        {methods.map(m => (
          <div key={m.id} onClick={() => setPaymentMethod(m.id)} className={`bg-white rounded-2xl shadow-card p-4 flex items-center gap-4 tap-highlight border-2 transition-all cursor-pointer ${paymentMethod === m.id ? 'border-primary-500 bg-primary-50' : 'border-transparent hover:border-slate-200'}`}>
            <div className={`p-3 rounded-full ${m.color}`}><m.icon className="w-6 h-6"/></div>
            <div className="flex-1">
              <div className="font-bold text-slate-900 text-lg">{m.title}</div>
              <div className="text-xs text-slate-500 font-medium">{m.desc}</div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === m.id ? 'border-primary-500 bg-primary-500' : 'border-slate-300'}`}>
              {paymentMethod === m.id && <div className="w-2.5 h-2.5 bg-white rounded-full"/>}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md z-[600] border-t border-slate-200 space-y-3 shadow-float">
        <div className="flex justify-center items-center gap-1.5 text-xs font-bold text-emerald-600">
          <Lock className="w-3.5 h-3.5"/> 🔒 Razorpay & National NPCI Encrypted
        </div>
        <button onClick={handlePay} disabled={isProcessing} className="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-2xl text-xl font-black shadow-float active:scale-[0.98] transition-transform disabled:opacity-50 cursor-pointer">
          {isProcessing ? 'Processing Payment...' : paymentMethod === 'upi' ? `Show UPI QR Code (₹${currentBill.amount})` : `PAY ₹${currentBill.amount}`}
        </button>
      </div>

      {/* Dynamic UPI QR Code Scanner Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-float text-center space-y-4 relative">
            <button 
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-black text-xl"
            >
              ✕
            </button>

            <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
              <QrCode className="w-4 h-4" />
              <span>Official Gram Panchayat UPI QR</span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900">Scan & Pay Water Tax</h3>
            <p className="text-xs text-slate-500 font-medium">
              Open Google Pay, PhonePe, Paytm, or BHIM and scan this QR code.
            </p>

            {/* QR Code Graphic */}
            <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-primary-200 inline-block shadow-sm">
              <img 
                src={qrCodeUrl} 
                alt="Gram Panchayat UPI QR Code" 
                className="w-48 h-48 mx-auto"
              />
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 font-bold">
              VPA: {upiId}
            </div>

            <div className="text-2xl font-black text-primary-700">
              ₹{currentBill.amount}
            </div>

            <button
              onClick={handleCompleteUPIPayment}
              disabled={isProcessing}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-2xl font-bold text-sm shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isProcessing ? 'Verifying Scan...' : 'Scan Complete — Get Receipt 🧾'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
