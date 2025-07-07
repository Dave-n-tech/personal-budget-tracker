import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { TransactionType } from "../../types/types";

type TransactionFormProps = {
  onClose: () => void;
  transactionId: string | null;
};
const TransactionForm: React.FC<TransactionFormProps> = ({
  onClose,
  transactionId,
}) => {
  const { transactions, categories, addTransaction, updateTransaction } =
    useAppContext();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [error, setError] = useState("");

  // If editing, populate form with transaction data
  useEffect(() => {
    if (transactionId) {
      const transaction = transactions.find((t) => t.id === transactionId);
      const category = categories.find((c) => c.id === transaction?.categoryId);
      console.log("from edit useEffect: category = ", category);
      if (transaction) {
        setDescription(transaction.description);
        setAmount(transaction.amount.toString());
        setCategory(category ? category.name : "");
        setDate(transaction.date.split("T")[0]);
        setType(transaction.type);
      }
    } else {
      // Default to today's date for new transactions
      const today = new Date().toISOString().split("T")[0];
      setDate(today);
    }

  }, [transactionId, transactions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Validate form
    if (!description.trim()) {
      setError("Please enter a description");
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount greater than zero");
      return;
    }
    if (type === TransactionType.EXPENSE && !category) {
      setError("Please select a category");
      return;
    }

    const transactionData = {
      description: description.trim(),
      amount: Number(amount),
      category: type === TransactionType.INCOME ? "income" : category,
      date: new Date(date).toISOString(),
      type,
      categoryId: category,
    };

    if (transactionId) {
      updateTransaction({
        ...transactionData,
        id: transactionId,
      });
    } else {
      addTransaction(transactionData);
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Transaction Type
        </label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="expense"
              checked={type === TransactionType.EXPENSE}
              onChange={() => setType(TransactionType.EXPENSE)}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-gray-700">Expense</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="income"
              checked={type === TransactionType.INCOME}
              onChange={() => setType(TransactionType.INCOME)}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-gray-700">Income</span>
          </label>
        </div>
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full py-2 px-3 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., Grocery shopping, Salary"
        />
      </div>
      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Amount
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">&#8358;</span>
          </div>
          <input
            type="number"
            id="amount"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="block w-full pl-7 pr-12 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
          />
        </div>
      </div>
      {type === TransactionType.EXPENSE && (
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block w-full py-2 px-3 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="block w-full py-2 px-3 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        />
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
          {transactionId ? "Update" : "Add"} Transaction
        </button>
      </div>
    </form>
  );
};
export default TransactionForm;
