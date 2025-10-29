interface FloatingButtonProps {
  onClick: () => void;
  icon: string;
  label?: string;
}

export default function FloatingButton({
  onClick,
  icon,
  label,
}: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className="group fixed bottom-6 right-6 z-20 rounded-full bg-blue-500 p-4 text-white shadow-lg transition-all duration-200 hover:bg-blue-600 hover:shadow-xl"
      title={label}
    >
      <i className={`${icon} text-xl`} />
      {label && (
        <span className="absolute right-full top-1/2 mr-3 -translate-y-1/2 transform whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
          {label}
        </span>
      )}
    </button>
  );
}
