import React, { useState } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import BudgetForm from "./BudgetForm";
import { Transaction } from "../../types/types";

interface Props {
  transactions: Transaction[];
}

const BudgetCategories: React.FC<Props> = ({ transactions }) => {
  const { categories, deleteCategory } = useAppContext();
  const [isBudgetFormOpen, setIsBudgetFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const spendingByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const handleDeleteCategory = (id: string) => {
    const hasTransactions = transactions.some((t) => t.category === id);
    if (hasTransactions) {
      alert("Cannot delete category with transactions. Reassign or delete them first.");
      return;
    }
    if (window.confirm("Delete this budget category?")) {
      deleteCategory(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Budget Categories</h2>
        <button
          onClick={() => {
            setEditingCategory(null);
            setIsBudgetFormOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm"
        >
          <PlusIcon size={16} className="mr-2" /> Add Category
        </button>
      </div>

      {isBudgetFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h2>
            <BudgetForm
              onClose={() => {
                setIsBudgetFormOpen(false);
                setEditingCategory(null);
              }}
              categoryId={editingCategory}
            />
          </div>
        </div>
      )}

      {categories.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No budget categories yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const spent = spendingByCategory[category.id] || 0;
            const remaining = category.budgetAmount - spent;
            const percentage = category.budgetAmount
              ? Math.min(Math.round((spent / category.budgetAmount) * 100), 100)
              : 0;

            return (
              <div
                key={category.id}
                className="border rounded-lg overflow-hidden hover:shadow-md"
                style={{ borderLeft: `4px solid ${category.color}` }}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{category.name}</h3>
                    <div className="flex space-x-1">
                      <button onClick={() => { setEditingCategory(category.id); setIsBudgetFormOpen(true); }}
                        className="p-1 text-blue-600 hover:text-blue-900">
                        <PencilIcon size={16} />
                      </button>
                      <button onClick={() => handleDeleteCategory(category.id)}
                        className="p-1 text-red-600 hover:text-red-900">
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>Budget: ${category.budgetAmount.toFixed(2)}</span>
                    <span>Spent: ${spent.toFixed(2)}</span>
                  </div>
                  <div className="mb-1">
                    <span className={`text-sm font-medium ${remaining >= 0 ? "text-green-600" : "text-red-600"}`}>
                      ${Math.abs(remaining).toFixed(2)} {remaining < 0 ? "over" : "remaining"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div className={`h-2.5 rounded-full ${percentage >= 100 ? "bg-red-600" : percentage >= 80 ? "bg-yellow-400" : "bg-green-500"}`}
                      style={{ width: `${percentage}%` }}></div>
                  </div>
                  <div className="text-xs text-gray-500 text-right">{percentage}% used</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BudgetCategories;
