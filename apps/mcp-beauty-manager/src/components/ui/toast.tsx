import { useEffect, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

const toastVariants = cva(
  'fixed bottom-4 right-4 flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg transition-all duration-300 ease-in-out',
  {
    variants: {
      variant: {
        default: 'bg-white border border-gray-200 text-gray-900',
        success: 'bg-green-50 border border-green-200 text-green-900',
        error: 'bg-red-50 border border-red-200 text-red-900',
        warning: 'bg-yellow-50 border border-yellow-200 text-yellow-900',
        info: 'bg-blue-50 border border-blue-200 text-blue-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface ToastProps extends VariantProps<typeof toastVariants> {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'default';
  duration?: number;
  onClose: () => void;
}

const iconMap = {
  success: { Icon: CheckCircle, className: 'text-green-600' },
  error: { Icon: AlertTriangle, className: 'text-red-600' },
  warning: { Icon: AlertTriangle, className: 'text-yellow-600' },
  info: { Icon: Info, className: 'text-blue-600' },
  default: { Icon: Info, className: 'text-gray-600' },
};

export default function Toast({
  message,
  type = 'default',
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const { Icon, className: iconClassName } = iconMap[type];

  return (
    <div
      className={cn(
        toastVariants({ variant: type }),
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      )}
      role="alert"
    >
      <Icon size={18} className={iconClassName} />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="text-gray-400 transition-colors hover:text-gray-600"
        aria-label="Close"
      >
        <X size={16} className="text-gray-600 hover:text-gray-800" />
      </button>
    </div>
  );
}

export { Toast };
