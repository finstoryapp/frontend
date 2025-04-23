// Returns the account's sum
import { expensesState } from "@/store/slices/expensesSlice/expensesState";
import { IGetFullMonthAccountSum } from "@/types/utilsTypes";
import { useSelector } from "react-redux";

export function getFullMonthAccountSum(args: IGetFullMonthAccountSum): number {
  const expenses = useSelector(expensesState).expenses;
  const expensesOfTheAccount = expenses
    ? expenses.filter((expense) => {
        return expense.accountId === String(args.accountId);
      })
    : [];
  const total = expensesOfTheAccount.reduce(
    (acc, expense) => acc + Number(expense.amount),
    0
  );
  return total;
}
