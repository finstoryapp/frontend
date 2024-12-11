"use client";
import styles from "./page.module.css";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { useEffect } from "react";
import { Spinner } from "@nextui-org/react";
import { fetchUtil } from "@/utils/utilFetch";
import { getUnixMonthStartEnd } from "@/utils/getUnixMonthStartEnd";
import { useDispatch, useSelector } from "react-redux";
import { setAccounts } from "@/store/slices/accountsSlice";
import { RootState } from "@/store/store";

export default function Accounts() {
  const dispatch = useDispatch();
  const { accounts, loading } = useSelector(
    (state: RootState) => state.accounts
  );

  const handleAddClick = () => {
    console.log(getUnixMonthStartEnd(2024, 12));
    accounts.forEach((element) => {
      console.log(element.id);
    });
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
          <div className={styles.accountHead}>
            <div className={styles.accountHeader}>
              <p>Сумма всех счетов</p>
              <button>
                <svg
                  width="8"
                  height="14"
                  viewBox="0 0 8 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L7 7L1 13"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className={styles.accountHeadWrapper}>
              <div className={styles.sum}>
                <p>Текущий месяц</p>
                <p className={styles.sumText}>-3100</p>
              </div>
              <div className={styles.currency}>
                <p className={styles.currencyHeader}>Валюта</p>
                <p className={styles.currencyText}>USD</p>
              </div>
            </div>
          </div>
          <div className={styles.accountsList}>
            {accounts.map((account) => (
              <div key={account.id} className={styles.accountItem}>
                <div className={styles.accountItemHeader}>
                  <p>{account.accountName}</p>
                  <button>
                    <svg
                      width="8"
                      height="15"
                      viewBox="0 0 8 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 1.5L7 7.5L1 13.5"
                        stroke="#81B1E0"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                <p>Валюта: {account.currency}</p>
              </div>
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
