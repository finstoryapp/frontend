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
