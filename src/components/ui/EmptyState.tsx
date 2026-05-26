import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actionText?: string;
  onAction?: () => void;
  iconColor?: string;
  iconBgColor?: string;
}

const EmptyState = ({
  title,
  description,
  icon: Icon,
  actionText,
  onAction,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10",
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 bg-surface-container-lowest border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-xl mx-auto my-6">
      {/* Dynamic inline floating animations keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-glide {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        .animated-floating-icon {
          animation: float-glide 4s ease-in-out infinite;
        }
      `}} />

      {/* Floating Decorative Gradients */}
      <div className="absolute -top-12 -left-12 w-28 h-28 bg-primary/5 rounded-full blur-2xl" />
      <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-secondary/5 rounded-full blur-2xl" />

      {/* Icon Area */}
      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${iconBgColor} ${iconColor} mb-6 shadow-sm border border-slate-100 dark:border-slate-800 animated-floating-icon shrink-0`}>
        <Icon size={40} className="stroke-[1.5]" />
      </div>

      {/* Content */}
      <h3 className="text-lg md:text-xl font-black text-slate-800 dark:text-slate-100 font-headline leading-tight">
        {title}
      </h3>
      
      <p className="text-xs md:text-sm text-on-surface-variant font-body mt-2.5 max-w-sm leading-relaxed">
        {description}
      </p>

      {/* Action CTA Button */}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-6 px-6 py-3 bg-primary text-white font-bold text-xs md:text-sm rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
