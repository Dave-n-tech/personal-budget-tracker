interface SummaryProps {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
}

export const FinanceSummary: React.FC<SummaryProps> = ({totalIncome, totalExpenses, balance}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Income</h3>
        <p className="mt-2 text-3xl font-bold text-green-600">
          &#8358;{totalIncome.toFixed(2)}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Expenses</h3>
        <p className="mt-2 text-3xl font-bold text-red-600">
          &#8358;{totalExpenses.toFixed(2)}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Balance</h3>
        <p
          className={`mt-2 text-3xl font-bold ${
            balance >= 0 ? "text-blue-600" : "text-red-600"
          }`}
        >
          &#8358;{balance.toFixed(2)}
        </p>
      </div>
    </div>
  );
};
