export interface IAccount {
  id: string;
  accountId: string;
  telegramId: string;
  accountName: string;
  currency: string;
}
export interface AccountsState {
  currentAccountIndex: number;
}
