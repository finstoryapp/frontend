"use client";
import { retrieveLaunchParams, parseInitData } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";
import { fetchUtil } from "../utils/utilFetch";
import { Spinner, user } from "@nextui-org/react";

import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import { RootState } from "@/store/store";

export default function Me() {
  const dispatch = useDispatch();
  const { userData, loading } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeUser() {
      try {
        const { initDataRaw } = retrieveLaunchParams();

        await fetchUtil("auth/login", {
          method: "POST",
          body: JSON.stringify({ initData: initDataRaw }),
        });

        const userData = await fetchUtil("api/me", {
          method: "GET",
        });
        dispatch(setUser(userData));
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setIsLoading(false);
      }
    }

    initializeUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-white">Error: {error}</div>;
  }

  return (
    <div
      className="text-sm"
      style={{ backgroundColor: "transparent", color: "white" }}
    >
      <div>
        <code style={{ display: "block" }}>Сообщение с сервера: </code>
        <br />
      </div>
    </div>
  );
}
