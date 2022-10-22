import { createContext } from "react";

export const TransactionContext = createContext([
  { id: '', timestamp: '', type: '', amount: '' },
]);
