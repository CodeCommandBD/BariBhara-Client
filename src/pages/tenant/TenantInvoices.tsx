import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Receipt, Download, FileText, CheckCircle2, Clock } from "lucide-react";
import { useTenantAuthStore } from "../../store/useTenantAuthStore";
import { useState } from "react";
import { toast } from "sonner";
import EmptyState from "@/components/ui/EmptyState";
import TenantPaymentModal from "@/components/modals/TenantPaymentModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/tenant-portal`;

const TenantInvoices = () => {
  const { token } = useTenantAuthStore();
  const queryClient = useQueryClient();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const authHeader = {
    Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
  };

  const { data: response, isLoading } = useQuery({
    queryKey: ["tenant-invoices"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/invoices`, { headers: authHeader });
      return res.data;
    },
    enabled: !!token,
  });

  const { data: paymentMethods } = useQuery({
    queryKey: ["landlord-payment-methods"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/landlord-payment-methods`, { headers: authHeader });
      return res.data.paymentMethods;
    },
    enabled: !!token,
  });

  const submitPaymentMutation = useMutation({
    mutationFn: async ({ invoiceId, payload }: { invoiceId: string; payload: any }) => {
      const res = await axios.post(`${API_URL}/invoices/${invoiceId}/submit-payment`, payload, { headers: authHeader });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "পেমেন্ট সাবমিট হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["tenant-invoices"] });
      setIsPaymentModalOpen(false);
      setSelectedInvoice(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "পেমেন্ট সাবমিট করতে সমস্যা হয়েছে!");
    }
  });

  const handleDownload = async (invoiceId: string, invoiceNumber: string) => {
    try {
      setDownloadingId(invoiceId);
      const res = await axios.get(`${API_URL}/invoices/${invoiceId}/pdf`, {
        headers: authHeader,
        responseType: "blob", // Important for PDF
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("ইনভয়েস ডাউনলোড সম্পন্ন হয়েছে!");
    } catch (err) {
      toast.error("ইনভয়েস ডাউনলোড করা যাচ্ছে না!");
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const invoices = response?.invoices || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Receipt size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">আমার বিলসমূহ</h1>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">আপনার সমস্ত ভাড়ার বিল ও পরিশোধের বিবরণ</p>
          </div>
        </div>
      </div>

      {/* Invoice List */}
        <div>
          {/* Mobile view cards */}
          <div className="md:hidden p-4 space-y-4">
            {invoices.length === 0 ? (
              <EmptyState
                title="কোনো ভাড়ার বিল বা ইনভয়েস নেই!"
                description="এই মুহূর্তে আপনার প্রোফাইলে কোনো পরিশোধিত বা বকেয়া বিলের হিসেব নেই। নতুন বিল তৈরি হলে নোটিফিকেশন পাবেন।"
                icon={Receipt}
              />
            ) : (
              invoices.map((invoice: any) => (
                <div
                  key={invoice._id}
                  className="bg-slate-50 dark:bg-slate-800/10 p-5 rounded-3xl border border-slate-100 dark:border-slate-800/40 flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-black text-xs">
                        {invoice.month.substring(0, 3)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{invoice.month} {invoice.year}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">INV-{invoice._id.toString().substring(0, 6)}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black ${
                      invoice.status === "Paid" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30" :
                      invoice.status === "Partial" ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30" :
                      "bg-red-100 text-red-600 dark:bg-red-900/30"
                    }`}>
                      {invoice.status}
                    </span>
                  </div>

                  {invoice.pendingPayment?.amount > 0 && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 p-2 rounded-xl text-center">
                      <p className="text-xs text-amber-700 dark:text-amber-400 font-bold flex items-center justify-center gap-1">
                        <Clock size={12} /> ৳{invoice.pendingPayment.amount} পেমেন্ট যাচাইয়ের অপেক্ষায়
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-slate-800/40 text-center">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">মোট বিল</p>
                      <p className="font-black text-sm text-slate-700 dark:text-slate-300 mt-1">৳{invoice.totalAmount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">পরিশোধিত</p>
                      <p className="font-black text-sm text-emerald-600 dark:text-emerald-400 mt-1">৳{invoice.paidAmount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">বকেয়া</p>
                      <p className="font-black text-sm text-red-500 dark:text-red-400 mt-1">৳{invoice.dueAmount}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    {invoice.status !== "Paid" && !(invoice.pendingPayment?.amount > 0) && (
                      <button
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setIsPaymentModalOpen(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white font-bold text-xs rounded-2xl transition-all shadow-lg shadow-primary/20 active:scale-95"
                      >
                        <Receipt size={14} /> পে নাও
                      </button>
                    )}
                    <button
                      onClick={() => handleDownload(invoice._id, invoice._id.toString().substring(0, 6))}
                      disabled={downloadingId === invoice._id}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-2xl transition-all disabled:opacity-50"
                    >
                      {downloadingId === invoice._id ? (
                        <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <>
                          <Download size={14} /> ডাউনলোড
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop view table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="p-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">মাস ও বছর</th>
                  <th className="p-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">মোট বিল</th>
                  <th className="p-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">পরিশোধিত</th>
                  <th className="p-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">বকেয়া</th>
                  <th className="p-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">স্ট্যাটাস</th>
                  <th className="p-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8">
                      <EmptyState
                        title="কোনো ভাড়ার বিল বা ইনভয়েস নেই!"
                        description="এই মুহূর্তে আপনার প্রোফাইলে কোনো পরিশোধিত বা বকেয়া বিলের হিসেব নেই। নতুন বিল তৈরি হলে নোটিফিকেশন পাবেন।"
                        icon={Receipt}
                      />
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice: any) => (
                    <tr key={invoice._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-black text-xs">
                            {invoice.month.substring(0, 3)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">{invoice.month} {invoice.year}</p>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">INV-{invoice._id.toString().substring(0, 6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-slate-700 dark:text-slate-300">৳{invoice.totalAmount}</td>
                      <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">৳{invoice.paidAmount}</td>
                      <td className="p-4 font-bold text-red-500 dark:text-red-400">৳{invoice.dueAmount}</td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black ${
                            invoice.status === "Paid" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30" :
                            invoice.status === "Partial" ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30" :
                            "bg-red-100 text-red-600 dark:bg-red-900/30"
                          }`}>
                            {invoice.status === "Paid" && <CheckCircle2 size={14} />}
                            {invoice.status === "Unpaid" && <Clock size={14} />}
                            {invoice.status === "Partial" && <FileText size={14} />}
                            {invoice.status}
                          </span>
                          {invoice.pendingPayment?.amount > 0 && (
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                              <Clock size={10} /> ৳{invoice.pendingPayment.amount} অপেক্ষমান
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {invoice.status !== "Paid" && !(invoice.pendingPayment?.amount > 0) && (
                            <button
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setIsPaymentModalOpen(true);
                              }}
                              className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl transition-all font-bold text-xs"
                            >
                              পে নাও
                            </button>
                          )}
                          <button
                            onClick={() => handleDownload(invoice._id, invoice._id.toString().substring(0, 6))}
                            disabled={downloadingId === invoice._id}
                            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white text-slate-600 dark:text-slate-300 rounded-xl transition-all disabled:opacity-50 inline-flex items-center justify-center"
                            title="রিসিট ডাউনলোড করুন"
                          >
                            {downloadingId === invoice._id ? (
                              <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                              <Download size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      {/* Payment Modal */}
      <TenantPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
        paymentMethods={paymentMethods}
        onSubmit={(data) => submitPaymentMutation.mutate({ invoiceId: selectedInvoice?._id, payload: data })}
        isSubmitting={submitPaymentMutation.isPending}
      />
    </div>
  );
};

export default TenantInvoices;
