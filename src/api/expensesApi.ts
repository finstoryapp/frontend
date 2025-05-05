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
    const request = fetchUtil(`api/add_expense`, {
      method: "POST",
      body: JSON.stringify(args),
    });
    return request;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An error occurred");
  }
}

// Delete a specific expense
export async function deleteExpense(expenseId: string) {
  try {
    const request = fetchUtil(`api/delete_expense/${expenseId}`, {
      method: "DELETE",
    });
    return request;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An error occurred");
  }
}
