
interface FloatingButtonProps {
  onClick: () => void;
  icon: string;
  label?: string;
}

export default function FloatingButton({ onClick, icon, label }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all duration-200 z-20 group"
      title={label}
    >
      <i className={`${icon} text-xl`}></i>
      {label && (
        <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          {label}
        </span>
      )}
    </button>
  );
}
