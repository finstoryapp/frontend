// Returns the account's sum

import { IGetFullMonthAccountSum } from "@/types/utilsTypes";

export function getFullMonthAccountSum(args: IGetFullMonthAccountSum): number {
  if (!args.expenses) return 0;

  const expensesOfTheAccount = args.expenses.filter(
    (expense) => expense.accountId === String(args.accountId)
  );

  const total = expensesOfTheAccount.reduce(
    (acc, expense) => acc + Number(expense.amount),
    0
  );
  return total;
}
