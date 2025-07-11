
export type Category = {
  id: string;
  name: string;
  budgetAmount: number;
  color: string;
};
export enum TransactionType {
  INCOME = "Income",
  EXPENSE = "Expense",
}
export type Transaction = {
  id: string;
  amount: number;
  category: string;
  categoryId: string;
  description: string;
  date: string;
  type: TransactionType;
};
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};
export type AppContextType = {
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