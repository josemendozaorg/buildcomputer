export interface Build {
  id: string;
  title: string;
  price: number;
  description: string;
}

export interface BuildCardProps {
  build: Build;
}

export default function BuildCard({ build }: BuildCardProps) {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      data-testid="build-card"
      className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:border-indigo-300 hover:shadow-md transition-all duration-200"
    >
      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-3">{build.title}</h3>

      {/* Price */}
      <div
        data-testid="build-price"
        className="text-3xl font-bold text-indigo-600 mb-4"
      >
        {formatCurrency(build.price)}
      </div>

      {/* Description */}
      <p data-testid="build-description" className="text-sm text-gray-600">
        {build.description}
      </p>
    </div>
  );
}
