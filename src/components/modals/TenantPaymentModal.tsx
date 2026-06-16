import React, { useState } from "react";
import { X, Send, CreditCard } from "lucide-react";

interface TenantPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
  paymentMethods: any;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

const TenantPaymentModal: React.FC<TenantPaymentModalProps> = ({ isOpen, onClose, invoice, paymentMethods, onSubmit, isSubmitting }) => {
  const [method, setMethod] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [amount, setAmount] = useState(invoice?.dueAmount || 0);

  if (!isOpen || !invoice) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ method, senderNumber, transactionId, amount });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <CreditCard size={20} className="text-primary" />
            ম্যানুয়াল পেমেন্ট
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto max-h-[70vh]">
          {/* Payment Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-2xl mb-6 text-sm">
            <p className="font-bold mb-2">নিচের যেকোনো নম্বরে টাকা সেন্ড মানি করুন:</p>
            <ul className="space-y-1">
              {paymentMethods?.bkash && <li><strong>বিকাশ:</strong> {paymentMethods.bkash}</li>}
              {paymentMethods?.nagad && <li><strong>নগদ:</strong> {paymentMethods.nagad}</li>}
              {paymentMethods?.rocket && <li><strong>রকেট:</strong> {paymentMethods.rocket}</li>}
              {paymentMethods?.bank && <li><strong>ব্যাংক:</strong> {paymentMethods.bank}</li>}
              {!paymentMethods?.bkash && !paymentMethods?.nagad && !paymentMethods?.rocket && !paymentMethods?.bank && (
                <li className="text-red-500">মালিক এখনো কোনো পেমেন্ট নম্বর যুক্ত করেননি।</li>
              )}
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">পেমেন্ট মেথড</label>
              <select
                required
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-primary/30 dark:text-slate-200"
              >
                <option value="">নির্বাচন করুন</option>
                <option value="bKash">bKash (বিকাশ)</option>
                <option value="Nagad">Nagad (নগদ)</option>
                <option value="Rocket">Rocket (রকেট)</option>
                <option value="Bank">Bank (ব্যাংক)</option>
                <option value="Cash">Cash (ক্যাশ)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">টাকার পরিমাণ (৳)</label>
              <input
                type="number"
                required
                min={1}
                max={invoice.dueAmount}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-primary/30 dark:text-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">আপনার নম্বর (যেখান থেকে টাকা পাঠিয়েছেন)</label>
              <input
                type="text"
                required
                placeholder="01XXXXXXXXX"
                value={senderNumber}
                onChange={(e) => setSenderNumber(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-primary/30 dark:text-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">ট্রানজেকশন আইডি (TxnID)</label>
              <input
                type="text"
                required
                placeholder="যেমন: A1B2C3D4E5"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-primary/30 dark:text-slate-200"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !method || !senderNumber || !transactionId}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-primary/20"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={18} /> পেমেন্ট সাবমিট করুন
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TenantPaymentModal;
