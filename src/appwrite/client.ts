import { Client, Account, Databases } from "appwrite";

const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECTID);


export const account = new Account(client);
export const databases = new Databases(client);
export { ID } from "appwrite";

export const databaseId = import.meta.env.VITE_DATABASE_ID;
export const transactionsCollectionId = import.meta.env.VITE_TRANSACTIONS_COLLECTION_ID;
export const categoriesCollectionId = import.meta.env.VITE_CATEGORY_COLLECTION_ID;

export default client;

