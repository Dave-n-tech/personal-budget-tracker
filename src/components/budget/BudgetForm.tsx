import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
type BudgetFormProps = {
  onClose: () => void;
  categoryId: string | null;
};
const BudgetForm: React.FC<BudgetFormProps> = ({ onClose, categoryId }) => {
  const { categories, addCategory, updateCategory } = useAppContext();
  const [name, setName] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [color, setColor] = useState("#3B82F6"); // Default blue color
  const [error, setError] = useState("");
  // Available colors
  const colorOptions = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#6B7280",
    "#F97316", // Orange
  ];
  // If editing, populate form with category data
  useEffect(() => {
    if (categoryId) {
      const category = categories.find((c) => c.id === categoryId);
      if (category) {
        setName(category.name);
        setBudgetAmount(category.budgetAmount.toString());
        setColor(category.color);
      }
    }
  }, [categoryId, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Validate form
    if (!name.trim()) {
      setError("Please enter a category name");
      return;
    }
    if (
      !budgetAmount ||
      isNaN(Number(budgetAmount)) ||
      Number(budgetAmount) < 0
    ) {
      setError("Please enter a valid budget amount");
      return;
    }

    const categoryData = {
      name: name.trim(),
      budgetAmount: Number(budgetAmount),
      color,
    };

    if (categoryId) {
      updateCategory({
        ...categoryData,
        id: categoryId,
      });
    } else {
      addCategory(categoryData);
    }
    
    onClose();
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Category Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full py-2 px-3 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., Groceries, Rent, Entertainment"
        />
      </div>
      <div>
        <label
          htmlFor="budgetAmount"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Budget Amount
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            id="budgetAmount"
            min="0"
            step="0.01"
            value={budgetAmount}
            onChange={(e) => setBudgetAmount(e.target.value)}
            className="block w-full pl-7 pr-12 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((colorOption) => (
            <button
              key={colorOption}
              type="button"
              onClick={() => setColor(colorOption)}
              className={`w-8 h-8 rounded-full ${
                color === colorOption
                  ? "ring-2 ring-offset-2 ring-blue-500"
                  : ""
              }`}
              style={{
                backgroundColor: colorOption,
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {categoryId ? "Update" : "Add"} Category
        </button>
      </div>
    </form>
  );
};
export default BudgetForm;
