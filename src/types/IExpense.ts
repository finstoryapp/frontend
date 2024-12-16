import { IAccount } from "./IAccount";

export interface IExpense {
  id: string;
  telegramId: string;
  createdAt: string;
  amount: string;
  accountId: string;
  categoryName: string;
  account: IAccount;
}
