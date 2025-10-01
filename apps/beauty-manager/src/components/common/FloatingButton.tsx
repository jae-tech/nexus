import { LucideIcon } from 'lucide-react';

interface FloatingButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  className?: string;
}

export default function FloatingButton({ onClick, icon: Icon, label, className }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-30 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 lg:hidden ${className || ''}`}
      title={label}
    >
      <Icon size={20} />
    </button>
  );
}