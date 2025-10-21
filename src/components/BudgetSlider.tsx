/**
 * BudgetSlider Component
 *
 * Interactive slider for selecting PC build budget:
 * - Range: $500 - $5000
 * - Step: $100
 * - Displays formatted currency value
 * - Triggers onChange callback when value changes
 */

interface BudgetSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function BudgetSlider({ value, onChange }: BudgetSliderProps) {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.target.value));
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <label
        htmlFor="budget-slider"
        className="block text-lg font-semibold text-gray-900 mb-4 text-center"
      >
        Select Your Budget
      </label>

      <div className="space-y-4">
        {/* Budget Value Display */}
        <div className="text-center">
          <div className="text-4xl font-bold text-indigo-600">
            {formatCurrency(value)}
          </div>
        </div>

        {/* Slider Input */}
        <input
          id="budget-slider"
          type="range"
          min="500"
          max="5000"
          step="100"
          value={value}
          onChange={handleChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                     slider:bg-indigo-600
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label="Budget slider"
        />

        {/* Min/Max Labels */}
        <div className="flex justify-between text-sm text-gray-600">
          <span>{formatCurrency(500)}</span>
          <span>{formatCurrency(5000)}</span>
        </div>
      </div>
    </div>
  );
}
