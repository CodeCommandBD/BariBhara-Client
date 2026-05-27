import { useState, useEffect } from "react";
import { X, Save, Zap, Droplets, Flame, ShieldAlert, Settings2, Loader2 } from "lucide-react";

interface UtilitySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: any;
  onSave: (id: string, utilityConfig: any) => void;
  isLoading: boolean;
}

const defaultUtility = { type: "None", fixedAmount: "", perUnitCost: "", lastReading: "" };

const UtilitySettingsModal = ({ isOpen, onClose, tenant, onSave, isLoading }: UtilitySettingsModalProps) => {
  const [config, setConfig] = useState<any>({
    electricity: { ...defaultUtility },
    water: { ...defaultUtility },
    gas: { ...defaultUtility },
    serviceCharge: { type: "None", fixedAmount: "" },
  });

  useEffect(() => {
    const toStr = (val: any) => (val === 0 || val === undefined || val === null) ? "" : String(val);

    if (tenant?.utilityConfig) {
      const uc = tenant.utilityConfig;
      setConfig({
        electricity: {
          type: uc.electricity?.type || "None",
          fixedAmount: toStr(uc.electricity?.fixedAmount),
          perUnitCost: toStr(uc.electricity?.perUnitCost),
          lastReading: toStr(uc.electricity?.lastReading),
        },
        water: {
          type: uc.water?.type || "None",
          fixedAmount: toStr(uc.water?.fixedAmount),
          perUnitCost: toStr(uc.water?.perUnitCost),
          lastReading: toStr(uc.water?.lastReading),
        },
        gas: {
          type: uc.gas?.type || "None",
          fixedAmount: toStr(uc.gas?.fixedAmount),
          perUnitCost: toStr(uc.gas?.perUnitCost),
          lastReading: toStr(uc.gas?.lastReading),
        },
        serviceCharge: {
          type: uc.serviceCharge?.type || "None",
          fixedAmount: toStr(uc.serviceCharge?.fixedAmount),
        },
      });
    } else {
      setConfig({
        electricity: { ...defaultUtility },
        water: { ...defaultUtility },
        gas: { ...defaultUtility },
        serviceCharge: { type: "None", fixedAmount: "" },
      });
    }
  }, [tenant]);

  if (!isOpen || !tenant) return null;

  const handleChange = (utility: string, field: string, value: any) => {
    setConfig((prev: any) => ({
      ...prev,
      [utility]: {
        ...prev[utility],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert string values to numbers before saving
    const numericConfig = {
      electricity: {
        ...config.electricity,
        fixedAmount: Number(config.electricity.fixedAmount) || 0,
        perUnitCost: Number(config.electricity.perUnitCost) || 0,
        lastReading: Number(config.electricity.lastReading) || 0,
      },
      gas: {
        ...config.gas,
        fixedAmount: Number(config.gas.fixedAmount) || 0,
        perUnitCost: Number(config.gas.perUnitCost) || 0,
        lastReading: Number(config.gas.lastReading) || 0,
      },
      water: {
        ...config.water,
        fixedAmount: Number(config.water.fixedAmount) || 0,
        perUnitCost: Number(config.water.perUnitCost) || 0,
        lastReading: Number(config.water.lastReading) || 0,
      },
      serviceCharge: {
        ...config.serviceCharge,
        fixedAmount: Number(config.serviceCharge.fixedAmount) || 0,
      },
    };
    onSave(tenant._id, numericConfig);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={!isLoading ? onClose : undefined} 
      />
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Settings2 className="text-blue-500" size={22} /> ইউটিলিটি সেটিংস
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              ভাড়াটিয়া: <span className="font-bold text-blue-600 dark:text-blue-400">{tenant.name}</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-white dark:bg-slate-900">
          <form id="utility-form" onSubmit={handleSubmit} className="space-y-6">
            <UtilityRow 
              title="বিদ্যুৎ বিল" icon={<Zap size={18} className="text-amber-500"/>} 
              utilityKey="electricity" data={config.electricity} onChange={handleChange} 
            />
            <UtilityRow 
              title="গ্যাস বিল" icon={<Flame size={18} className="text-orange-500"/>} 
              utilityKey="gas" data={config.gas} onChange={handleChange} 
            />
            <UtilityRow 
              title="পানির বিল" icon={<Droplets size={18} className="text-blue-500"/>} 
              utilityKey="water" data={config.water} onChange={handleChange} 
            />
            
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center">
                  <ShieldAlert size={18} className="text-purple-500"/>
                </div>
                <h3 className="font-bold text-slate-700 dark:text-slate-200">সার্ভিস চার্জ</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">বিলের ধরন</label>
                  <select 
                    value={config.serviceCharge.type}
                    onChange={(e) => handleChange("serviceCharge", "type", e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 rounded-xl outline-none text-sm font-bold border border-slate-200 dark:border-slate-700 focus:border-blue-300 dark:text-slate-200"
                  >
                    <option value="None">নেই (None)</option>
                    <option value="Fixed">নির্ধারিত (Fixed)</option>
                  </select>
                </div>
                {config.serviceCharge.type === "Fixed" && (
                  <div className="space-y-1.5 animate-in fade-in zoom-in duration-200">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">নির্ধারিত অ্যামাউন্ট</label>
                    <input 
                      type="number" min="0"
                      value={config.serviceCharge.fixedAmount}
                      onChange={(e) => handleChange("serviceCharge", "fixedAmount", e.target.value)}
                      placeholder="যেমন: ৫০০"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 rounded-xl outline-none text-sm font-bold border border-slate-200 dark:border-slate-700 focus:border-blue-300 dark:text-slate-200"
                    />
                  </div>
                )}
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            বাতিল
          </button>
          <button
            type="submit"
            form="utility-form"
            disabled={isLoading}
            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            সেটিংস সেভ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

const UtilityRow = ({ title, icon, utilityKey, data, onChange }: any) => {
  return (
    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center">
            {icon}
          </div>
          <h3 className="font-bold text-slate-700 dark:text-slate-200">{title}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1">বিলের ধরন</label>
          <select 
            value={data.type}
            onChange={(e) => onChange(utilityKey, "type", e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 rounded-xl outline-none text-sm font-bold border border-slate-200 dark:border-slate-700 focus:border-blue-300 dark:text-slate-200"
          >
            <option value="None">নেই (None)</option>
            <option value="Fixed">নির্ধারিত (Fixed)</option>
            <option value="Metered">ইউনিট হিসাব (Metered)</option>
          </select>
        </div>

        {data.type === "Fixed" && (
          <div className="space-y-1.5 animate-in fade-in zoom-in duration-200 col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">নির্ধারিত অ্যামাউন্ট (টাকা)</label>
            <input 
              type="number" min="0"
              value={data.fixedAmount}
              onChange={(e) => onChange(utilityKey, "fixedAmount", e.target.value)}
              placeholder="যেমন: ১০০০"
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 rounded-xl outline-none text-sm font-bold border border-slate-200 dark:border-slate-700 focus:border-blue-300 dark:text-slate-200"
            />
          </div>
        )}

        {data.type === "Metered" && (
          <div className="space-y-1.5 animate-in fade-in zoom-in duration-200 col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">প্রতি ইউনিট দাম (টাকা)</label>
            <input 
              type="number" min="0" step="0.01"
              value={data.perUnitCost}
              onChange={(e) => onChange(utilityKey, "perUnitCost", e.target.value)}
              placeholder="যেমন: ৭.৫০"
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 rounded-xl outline-none text-sm font-bold border border-slate-200 dark:border-slate-700 focus:border-blue-300 dark:text-slate-200"
            />
            <p className="text-[10px] text-blue-500 ml-1">💡 বিল জেনারেটের সময় শুধু এই মাসের ব্যবহৃত ইউনিট দিলেই বিল হিসাব হবে।</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UtilitySettingsModal;
