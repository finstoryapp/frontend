import { IAccount } from "./accountsTypes";

export interface IExpense {
  id: string;
  telegramId: string;
  createdAt: string;
  amount: string;
  accountId: string;
  categoryName: string;
  account: IAccount;
}
export interface ExpensesState {
  loadingExpenses: boolean;
  isAddExpenseWindowOpen: boolean;
  expenses: IExpense[] | null;
  isAddingExpense: boolean;
}
export interface IExpensesAmount {
  accountName: string;
  currency: string;
  accountId: string;
  sum: number;
}
export interface IFullSumAccumulator {
  currency: string;
  amount: number;
}
export type IAddExpense = {
  amount: number;
  accountId: number;
  categoryName: string;
  time: number;
};
