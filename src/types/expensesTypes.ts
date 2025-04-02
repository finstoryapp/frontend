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
  currentMonth: number;
  currentYear: number;
  loadingExpenses: boolean;
  isAddExpenseWindowOpen: boolean;
  expenses: IExpense[] | null;
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
