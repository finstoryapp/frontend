import { IUser, IAddCategory, IUpdateCategory } from "@/types/userTypes";
import { fetchUtil } from "./apiClient";
import { retrieveRawInitData } from "@telegram-apps/sdk";

// Auth user
export async function authUser(): Promise<IUser> {
  try {
    const initDataRaw = retrieveRawInitData();
    await fetchUtil("auth/login", {
      method: "POST",
      body: JSON.stringify({ initData: initDataRaw }),
    });
    // authUser returns user's data after login
    return await getUserData();
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An error occurred");
  }
}

// Get user's settings data
export async function getUserData(): Promise<IUser> {
  try {
    const userData: IUser = await fetchUtil("api/me", {
      method: "GET",
    });
    return userData;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An error occurred");
  }
}

// Set user's currency
export async function setCurrency(currency: string) {
  try {
    const request = await fetchUtil("api/update_default_currency", {
      method: "PUT",
      body: JSON.stringify({
        currency: currency,
      }),
    });
    return request;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An error occurred");
  }
}

// Add category
export async function addCategory(args: IAddCategory): Promise<void> {
  try {
    const request = fetchUtil(`api/add_category`, {
      method: "POST",
      body: JSON.stringify(args),
    });
    return request;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An error occurred");
  }
}

// Delete category
export async function deleteCategory(categoryName: string): Promise<void> {
  try {
    const request = fetchUtil(`api/delete_category/${categoryName}`, {
      method: "DELETE",
    });
    return request;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An error occurred");
  }
}

// Update category's color
export async function updateCategory(args: IUpdateCategory): Promise<void> {
  try {
    const request = fetchUtil(`api/update_category`, {
      method: "PUT",
      body: JSON.stringify(args),
    });
    return request;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An error occurred");
  }
}

// Get excel file sheet
export async function getExcel(): Promise<void> {
  try {
    const request = fetchUtil(`api/get_excel`, {
      method: "GET",
    });
    return request;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An error occurred");
  }
}
