import React, { useEffect, useState, createContext, useContext } from "react";
// Define types
export type Category = {
  id: string;
  name: string;
  budgetAmount: number;
  color: string;
};
export type Transaction = {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: "income" | "expense";
};
type User = {
  id: string;
  name: string;
  email: string;
};
type AppContextType = {
  user: User | null;
  transactions: Transaction[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  setUser: (user: User | null) => void;
};
const AppContext = createContext<AppContextType | undefined>(undefined);
// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: "1",
    amount: 3500,
    category: "income",
    description: "Monthly Salary",
    date: new Date(2023, 9, 1).toISOString(),
    type: "income",
  },
  {
    id: "2",
    amount: 1200,
    category: "1",
    description: "Rent Payment",
    date: new Date(2023, 9, 3).toISOString(),
    type: "expense",
  },
  {
    id: "3",
    amount: 85.75,
    category: "2",
    description: "Grocery Shopping",
    date: new Date(2023, 9, 5).toISOString(),
    type: "expense",
  },
  {
    id: "4",
    amount: 45.5,
    category: "3",
    description: "Gas",
    date: new Date(2023, 9, 7).toISOString(),
    type: "expense",
  },
  {
    id: "5",
    amount: 120,
    category: "4",
    description: "Concert Tickets",
    date: new Date(2023, 9, 10).toISOString(),
    type: "expense",
  },
  {
    id: "6",
    amount: 200,
    category: "5",
    description: "Electricity Bill",
    date: new Date(2023, 9, 15).toISOString(),
    type: "expense",
  },
  {
    id: "7",
    amount: 500,
    category: "income",
    description: "Freelance Work",
    date: new Date(2023, 9, 18).toISOString(),
    type: "income",
  },
  {
    id: "8",
    amount: 60.25,
    category: "2",
    description: "Dinner with Friends",
    date: new Date(2023, 9, 20).toISOString(),
    type: "expense",
  },
  {
    id: "9",
    amount: 35,
    category: "3",
    description: "Uber Ride",
    date: new Date(2023, 9, 22).toISOString(),
    type: "expense",
  },
  {
    id: "10",
    amount: 150,
    category: "5",
    description: "Internet Bill",
    date: new Date(2023, 9, 25).toISOString(),
    type: "expense",
  },
];
// Default categories
const defaultCategories: Category[] = [
  {
    id: "1",
    name: "Housing",
    budgetAmount: 1500,
    color: "#FF5733",
  },
  {
    id: "2",
    name: "Food",
    budgetAmount: 500,
    color: "#33FF57",
  },
  {
    id: "3",
    name: "Transportation",
    budgetAmount: 200,
    color: "#3357FF",
  },
  {
    id: "4",
    name: "Entertainment",
    budgetAmount: 150,
    color: "#F033FF",
  },
  {
    id: "5",
    name: "Utilities",
    budgetAmount: 300,
    color: "#FF9033",
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("budget_tracker_user");
    const storedTransactions = localStorage.getItem(
      "budget_tracker_transactions"
    );
    const storedCategories = localStorage.getItem("budget_tracker_categories");

    
    if (storedUser) setUser(JSON.parse(storedUser));
    // Set transactions - use mock data if none exist
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
      console.log(transactions)
    } else {
      setTransactions(mockTransactions);
      localStorage.setItem(
        "budget_tracker_transactions",
        JSON.stringify(mockTransactions)
      );
    }

    // Set categories - use defaults if none exist
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      setCategories(defaultCategories);
      localStorage.setItem(
        "budget_tracker_categories",
        JSON.stringify(defaultCategories)
      );
      console.log(defaultCategories)
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) localStorage.setItem("budget_tracker_user", JSON.stringify(user));
    localStorage.setItem(
      "budget_tracker_transactions",
      JSON.stringify(transactions)
    );
    localStorage.setItem(
      "budget_tracker_categories",
      JSON.stringify(categories)
    );
  }, [user, transactions, categories]);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([...transactions, newTransaction]);
  };
  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === updatedTransaction.id
          ? updatedTransaction
          : transaction
      )
    );
  };
  const deleteTransaction = (id: string) => {
    setTransactions(
      transactions.filter((transaction) => transaction.id !== id)
    );
  };
  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories([...categories, newCategory]);
  };
  const updateCategory = (updatedCategory: Category) => {
    setCategories(
      categories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
  };
  const deleteCategory = (id: string) => {
    setCategories(categories.filter((category) => category.id !== id));
  };
  return (
    <AppContext.Provider
      value={{
        user,
        transactions,
        categories,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
