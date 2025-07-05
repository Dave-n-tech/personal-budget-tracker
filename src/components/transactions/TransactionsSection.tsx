import React, { useState } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import { format } from "date-fns";
import { useAppContext } from "../../context/AppContext";
import TransactionForm from "./TransactionForm";
import { Category, Transaction, TransactionType } from "../../types/types";

interface Props {
  transactions: Transaction[];
  categories: Category[];
}

const TransactionsSection: React.FC<Props> = ({ transactions, categories }) => {
  const { deleteTransaction } = useAppContext();
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<string | null>(
    null
  );
  const [filter, setFilter] = useState("all");

  // console.log("TransactionsSection rendered: ", transactions);

  const getCategoryName = (id: string, type: TransactionType) => {
    if (type === TransactionType.INCOME) return "Income";
    return categories.find((c) => c.id === id)?.name || "Uncategorized";
  }

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm("Delete this transaction?")) {
      deleteTransaction(id);
    }
  };

  const filtered = transactions.filter((t) => {
    if (filter === "all") return true;
    if (filter === "income") return t.type === TransactionType.INCOME;
    if (filter === "expense") return t.type === TransactionType.EXPENSE;
    return t.category === filter;
  });

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">Transactions</h2>
        <button
          onClick={() => {
            setEditingTransaction(null);
            setIsTransactionFormOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm"
        >
          <PlusIcon size={16} className="mr-2" /> Add Transaction
        </button>
      </div>

      {isTransactionFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingTransaction ? "Edit Transaction" : "Add Transaction"}
            </h2>
            <TransactionForm
              onClose={() => {
                setIsTransactionFormOpen(false);
                setEditingTransaction(null);
              }}
              transactionId={editingTransaction}
            />
          </div>
        </div>
      )}

      <div className="p-4 border-b">
        <div className="flex flex-wrap gap-2">
          {["all", "income", "expense", ...categories.map((c) => c.id)].map(
            (type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1 text-sm rounded-full ${
                  filter === type
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {type === "all"
                  ? "All"
                  : type === "income"
                  ? "Income"
                  : type === "expense"
                  ? "Expenses"
                  : categories.find((c) => c.id === type)?.name}
              </button>
            )
          )}
        </div>
      </div>

      <div className="p-6">
        {sorted.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No transactions found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sorted.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4">
                      {format(new Date(transaction.date), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4">{transaction.description}</td>
                    <td className="px-6 py-4">
                      {getCategoryName(transaction.categoryId, transaction.type)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          transaction.type === TransactionType.INCOME
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {transaction.type === TransactionType.INCOME ? "+" : "-"}$
                        {transaction.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setEditingTransaction(transaction.id);
                          setIsTransactionFormOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <PencilIcon size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsSection;
