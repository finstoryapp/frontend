import { IAccount } from "@/types/accountsTypes";
import { fetchUtil } from "./apiClient";
// Get user's accounts
export async function getAccounts(): Promise<IAccount[]> {
  try {
    const accounts = fetchUtil("api/accounts_list", {
      method: "GET",
    });
    return accounts;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An error occurred");
  }
}
