import React from "react";
import { useAppContext } from "../context/AppContext";
import { Header } from "../components/header/Header";
import { FinanceSummary } from "../components/dashboard/FinanceSummary";
import BudgetCategories from "../components/budget/BudgetCategories";
import TransactionsSection from "../components/transactions/TransactionsSection";
import { TransactionType } from "../types/types";

interface MainPageProps {
  onProfileClick: () => void;
}

const MainPage: React.FC<MainPageProps> = ({ onProfileClick }) => {
  const { transactions, categories } =
    useAppContext();

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === TransactionType.INCOME)
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === TransactionType.EXPENSE)
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onProfileClick={onProfileClick} />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <FinanceSummary
            totalExpenses={totalExpenses}
            totalIncome={totalIncome}
            balance={balance}
          />
          <BudgetCategories transactions={transactions} />
          <TransactionsSection
            transactions={transactions}
            categories={categories}
          />
        </div>
      </main>
    </div>
  );
};
export default MainPage;
