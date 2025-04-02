import { IExpense } from "@/types/expensesTypes";
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
