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
