import { IUser } from "@/types/userTypes";
import { fetchUtil } from "./apiClient";
import { retrieveLaunchParams } from "@telegram-apps/sdk";

// Auth user
export async function authUser(): Promise<IUser> {
  try {
    const { initDataRaw } = retrieveLaunchParams();
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
