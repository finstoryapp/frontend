import { IAccount } from "./accountsTypes";
import { IExpense } from "./expensesTypes";

export interface IYearAndMonth {
  year: number;
  month: number;
}
export interface WeekDay {
  date: string;
  unix: number;
}
export type IGetFullMonthAccountSum = {
  expenses: IExpense[] | null;
  accountId: number;
};
export type IGetRate = {
  fromCurrency: string;
  toCurrency: string;
};
export interface ICurrencyRate {
  from: string;
  to: string;
  rate: number;
}
export interface IRate {
  currency: string;
  rate: number;
}
export type IGetFullMonthSum = {
  expenses: IExpense[] | null;
  accounts: IAccount[] | null;
  defaultCurrency: string;
  rates: IRate[];
};
