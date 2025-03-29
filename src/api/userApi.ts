import { IUser } from "@/types/userTypes";
import { fetchUtil } from "./apiClient";
import { retrieveLaunchParams } from "@telegram-apps/sdk";

export async function authUser() {
  try {
    const { initDataRaw } = retrieveLaunchParams();
    console.log(initDataRaw);

    await fetchUtil("auth/login", {
      method: "POST",
      body: JSON.stringify({ initData: initDataRaw }),
    });
    const userData: IUser = await fetchUtil("api/me", {
      method: "GET",
    });

    return userData;
  } catch (err) {
    console.log(err instanceof Error ? err.message : "An error occurred");
  }
}
