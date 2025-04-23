import { IAddExpense, IExpense } from "@/types/expensesTypes";
import { fetchUtil } from "./apiClient";

// Get user's expenses
export async function getExpenses(
  start: number,
  end: number
): Promise<IExpense[]> {
  try {
    const expenses = fetchUtil(
      `api/expenses_list/range?from=${start}&to=${end}`
    );
    return expenses;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An error occurred");
  }
}

// Add new expense
export async function addExpense(args: IAddExpense): Promise<IExpense> {
  try {
    const expense: IAddExpense = {
      amount: args.amount,
      accountId: args.accountId,
      categoryName: args.categoryName,
      time: args.time,
    };
    const request = fetchUtil(`api/add_expense`, {
      method: "POST",
      body: JSON.stringify(expense),
    });
    return request;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An error occurred");
  }
}
