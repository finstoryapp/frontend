"use client";
import styles from "./page.module.css";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { useEffect } from "react";
import { Spinner } from "@nextui-org/react";
import { fetchUtil } from "@/utils/utilFetch";
import { useDispatch, useSelector } from "react-redux";
import { setAccounts } from "@/store/slices/accountsSlice";
import { RootState } from "@/store/store";

export default function Accounts() {
  const dispatch = useDispatch();
  const { accounts, loading } = useSelector(
    (state: RootState) => state.accounts
  );

  const handleAddClick = () => {
    console.log("Current accounts:", accounts);
  };

  useEffect(() => {
    async function fetchAccounts() {
      const accounts = await fetchUtil("api/accounts_list", {
        method: "GET",
      });
      dispatch(setAccounts(accounts));
    }
    fetchAccounts();
  }, [dispatch]);

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loading}>
          <Spinner />
        </div>
      ) : (
        <>
          <div className={styles.accountsList}>
            {accounts.map((account) => (
              <div key={account.id}>{account.name}</div>
            ))}
          </div>
          <div className={styles.addButton}>
            <Button
              color="primary"
              onPress={handleAddClick}
              className={styles.addButtonStyled}
              endContent={
                <Image
                  src="/icons/plus.svg"
                  alt="plus"
                  width={24}
                  height={24}
                />
              }
            >
              Создать счёт
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
