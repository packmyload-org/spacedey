interface PriceMarkerProps {
  price: number;
  onClick?: () => void;
}

export default function PriceMarker({ price, onClick }: PriceMarkerProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-full bg-brand-dark-blue py-2 px-3 drop-shadow text-xs text-white cursor-pointer hover:bg-opacity-90 transition"
    >
      ${price.toFixed(2)}
    </button>
  );
}