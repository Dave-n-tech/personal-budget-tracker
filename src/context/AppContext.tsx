import React, { useEffect, useState, createContext, useContext } from "react";
import { AppContextType, Category, Transaction, User } from "../types/types";
import {
  account,
  categoriesCollectionId,
  databaseId,
  databases,
  ID,
  transactionsCollectionId,
} from "../appwrite/client";
import { Query } from "appwrite";

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Load user data from appwrite on initialization
  useEffect(() => {
    const loadData = async () => {
      try {
        const accountInfo = await account.get();
        console.log(accountInfo)

        setUser({
          id: accountInfo.$id,
          name: accountInfo.name,
          email: accountInfo.email,
        });

        const transactionsResponse = await databases.listDocuments(
          databaseId,
          transactionsCollectionId,
          [
            Query.equal("userId", accountInfo.$id), // Filter by user ID
          ]
        );

        setTransactions(
          transactionsResponse.documents.map((doc) => ({
            id: doc.$id,
            amount: doc.amount,
            category: doc.category,
            categoryId: doc.categoryId,
            description: doc.description,
            date: doc.date,
            type: doc.type,
          }))
        );

        const categoriesResponse = await databases.listDocuments(
          databaseId,
          categoriesCollectionId,
          [
            Query.equal("userId", accountInfo.$id), // Filter by user ID
          ]
        );
        setCategories(
          categoriesResponse.documents.map((doc) => ({
            id: doc.$id,
            name: doc.name,
            budgetAmount: doc.budgetAmount,
            color: doc.color,
          }))
        );
      } catch (error) {
        console.error("Appwrite load error:", error);
      }
    };

    loadData();

    // console.log("Transactions loaded:", transactions);
    // console.log("Categories loaded:", categories);
  }, []);

  // Transaction management
  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    const response = await databases.createDocument(
      databaseId,
      transactionsCollectionId,
      ID.unique(),
      {...transaction,
        userId: user?.id,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }
    );
    console.log("Transaction added:", response);
    setTransactions([...transactions, { ...transaction, id: response.$id, category: response.category}]);
  };

  const updateTransaction = async (updatedTransaction: Transaction) => {
    await databases.updateDocument(
      databaseId,
      transactionsCollectionId,
      updatedTransaction.id,
      updatedTransaction
    );
    setTransactions(
      transactions.map((tx) =>
        tx.id === updatedTransaction.id ? updatedTransaction : tx
      )
    );
  };

  const deleteTransaction = async (id: string) => {
    await databases.deleteDocument(databaseId, transactionsCollectionId, id);
    setTransactions(transactions.filter((tx) => tx.id !== id));
  };

  // Category management
  const addCategory = async (category: Omit<Category, "id">) => {
    const response = await databases.createDocument(
      databaseId,
      categoriesCollectionId,
      ID.unique(),
      {
        ...category,
        userId: user?.id,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }
    );
    // console.log("Category added:", response);
    setCategories([...categories, { ...category, id: response.$id }]);
  };

  const updateCategory = async (updatedCategory: Category) => {
    await databases.updateDocument(
      databaseId,
      categoriesCollectionId,
      updatedCategory.id,
      updatedCategory
    );
    setCategories(
      categories.map((cat) =>
        cat.id === updatedCategory.id ? updatedCategory : cat
      )
    );
  };

  const deleteCategory = async (id: string) => {
    await databases.deleteDocument(databaseId, categoriesCollectionId, id);
    setCategories(categories.filter((cat) => cat.id !== id));
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

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
