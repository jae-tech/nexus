interface ServiceRankItemProps {
  rank: number;
  name: string;
  price: string;
  count: string;
}

export function ServiceRankItem({
  rank,
  name,
  price,
  count,
}: ServiceRankItemProps) {
  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-800";
      case 2:
        return "bg-gray-100 text-gray-800";
      case 3:
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${getRankStyle(rank)}`}
        >
          {rank}
        </div>
        <div>
          <p className="font-medium text-gray-900">{name}</p>
          <p className="text-sm text-gray-600">{price}</p>
        </div>
      </div>
      <span className="text-sm font-medium text-blue-600">{count}</span>
    </div>
  );
}
