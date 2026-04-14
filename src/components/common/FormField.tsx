interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  icon: string;
  register: any;
  error?: string;
}

const FormField = ({
  label,
  name,
  type = "text",
  placeholder,
  icon,
  register,
  error,
}: FormFieldProps) => {
  return (
    <div className="group">
      <label className="block text-sm font-semibold text-on-surface-variant mb-2 ml-1 italic">
        {label}
      </label>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">
          {icon}
        </span>
        <input
          {...register(name)}
          type={type}
          placeholder={placeholder}
          className={`w-full pl-12 pr-4 py-4 bg-white rounded-xl border ${error ? "border-error" : "border-outline/10"} focus:ring-2 focus:ring-primary/20 transition-all shadow-sm`}
        />
      </div>
      {error && <p className="text-error text-xs mt-1 ml-1">{error}</p>}
    </div>
  );
};

export default FormField;
