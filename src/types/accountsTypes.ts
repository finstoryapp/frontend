export interface IAccount {
  id: string;
  accountId: string;
  telegramId: string;
  accountName: string;
  currency: string;
}
export interface AccountsState {
  currentAccountIndex: number;
  currentAccountId: number;
  isDeleteAccountWindow: boolean;
  isAddingAccountWindow: boolean;
}
export interface IAddAccount {
  accountName: string;
  currency: string;
}
