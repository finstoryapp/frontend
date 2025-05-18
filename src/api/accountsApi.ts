import { IAccount, IAddAccount, IUpdateAccount } from "@/types/accountsTypes";
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

// Delete an account by id
export async function deleteAccount(accountId: number): Promise<void> {
  try {
    const request = fetchUtil(`api/delete_account/${accountId}`, {
      method: "DELETE",
    });
    return request;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An error occurred");
  }
}

// Add a new account
export async function addAccount(args: IAddAccount): Promise<void> {
  try {
    const request = fetchUtil(`api/add_account`, {
      method: "POST",
      body: JSON.stringify(args),
    });
    return request;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An error occurred");
  }
}

// Update an account
export async function updateAccount(args: IUpdateAccount): Promise<void> {
  const updatedAccountData = {
    accountName: args.accountName,
    currency: args.currency,
  };

  try {
    const request = fetchUtil(`api/update_account/${args.accountId}`, {
      method: "PUT",
      body: JSON.stringify(updatedAccountData),
    });
    return request;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An error occurred");
  }
}
