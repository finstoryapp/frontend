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
  isAddExpenseWindowOpen: boolean;
  isDeleteExpenseWindow: boolean;
  selectedExpenseId: string;
}
export interface IExpensesAmount {
  accountName: string;
  currency: string;
  accountId: string;
  sum: number;
}
export type IAddExpense = {
  amount: number;
  accountId: number;
  categoryName: string;
  time: number;
};
export interface IFullMonthExpense {
  accountsData: IAccount[];
  defaultCurrency: string;
}
