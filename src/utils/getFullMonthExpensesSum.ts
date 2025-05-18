import { getFullMonthAccountSum } from "./getFullMonthAccountSum";
import { IGetFullMonthSum } from "@/types/utilsTypes";

export function getFullMonthExpensesSum(args: IGetFullMonthSum): number {
  if (!args.accounts || !args.expenses) return 0;
  const { expenses, accounts, defaultCurrency, rates } = args;
  const sum = accounts.reduce((total, account) => {
    const sum = getFullMonthAccountSum({
      expenses,
      accountId: Number(account.accountId),
    });

    if (account.currency === defaultCurrency) {
      return total + sum;
    }

    const rate = rates?.find((r) => r.currency === account.currency)?.rate ?? 1;
    return total + sum / rate;
  }, 0);
  return sum;
}
