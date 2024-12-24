"use client";
import styles from "./accounts.module.css";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { useEffect } from "react";
import { Spinner, useDisclosure } from "@nextui-org/react";
import { fetchUtil } from "@/utils/utilFetch";
import { useDispatch, useSelector } from "react-redux";
import { setAccounts } from "@/store/slices/accountsSlice";
import { RootState } from "@/store/store";
import { IAccount } from "@/types/IAccount";
import { setUser } from "@/store/slices/userSlice";
import { IUser } from "@/store/slices/userSlice";
import { retrieveLaunchParams } from "@telegram-apps/sdk";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@nextui-org/drawer";

export default function Accounts() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const dispatch = useDispatch();
  const { userData } = useSelector((state: RootState) => state.user);
  const { accounts, loading_accounts } = useSelector(
    (state: RootState) => state.accounts
  );
  const currencies = [
    "USD",
    "RUB",
    "EUR",
    "AMD",
    "UAH",
    "BYN",
    "KZT",
    "GEL",
    "KGS",
    "MDL",
    "TJS",
    "UZS",
  ];
  const handleAddClick = () => {
    onOpen();
    accounts.forEach((element) => {
      console.log(element.id);
    });
  };
  async function fetchAccounts() {
    const accounts: IAccount[] = await fetchUtil("api/accounts_list", {
      method: "GET",
    });
    dispatch(setAccounts(accounts));
  }
  async function initializeUser() {
    try {
      const { initDataRaw } = retrieveLaunchParams();

      await fetchUtil("auth/login", {
        method: "POST",
        body: JSON.stringify({ initData: initDataRaw }),
      });
      const userData: IUser = await fetchUtil("api/me", {
        method: "GET",
      });
      console.log(userData);
      dispatch(setUser(userData));
    } catch (err) {
      console.log(err instanceof Error ? err.message : "An error occurred");
    }
  }

  useEffect(() => {
    initializeUser();
    fetchAccounts();
  }, [dispatch]);

  return (
    <div className={styles.container}>
      {loading_accounts ? (
        <div className={styles.loading}>
          <Spinner />
        </div>
      ) : (
        <div>
          <div className={styles.accountHead}>
            <div className={styles.accountHeader}>
              <p>Управление счетами</p>
            </div>
            <p className={styles.currencyHeader}>
              Основная валюта - {userData?.defaultCurrency}
            </p>
          </div>
          <div className={styles.accountsList}>
            {accounts.map((account) => (
              <div key={account.id} className={styles.accountItem}>
                <div className={styles.accountItemHeader}>
                  <p>{account.accountName}</p>
                  {accounts.length !== 1 ? (
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
                  ) : (
                    ""
                  )}
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
          <Drawer
            isOpen={isOpen}
            placement={"bottom"}
            onOpenChange={onOpenChange}
            className="dark"
            backdrop="blur"
            hideCloseButton
            disableAnimation
          >
            <DrawerContent className={styles.drawer}>
              {(onClose) => (
                <div>
                  <DrawerHeader
                    className={`flex gap-1 pb-0 ${styles.drawerHeader}`}
                  >
                    <button
                      onClick={() => {
                        onClose();
                      }}
                      className={styles.closeButton}
                    >
                      <img src="/icons/close.svg" alt="close" />
                    </button>
                    Новый счет
                  </DrawerHeader>
                  <DrawerBody className={styles.drawerBody}>
                    <div className={styles.accountName}>
                      <p>Название счета</p>
                      <input type="text" />
                    </div>
                    <div className={styles.accountCurrency}>
                      {currencies.map((currency) => {
                        return (
                          <span
                            onClick={() => {}}
                            className={`${styles.currencyItem}`}
                            key={currency}
                          >
                            {currency}
                          </span>
                        );
                      })}
                    </div>
                  </DrawerBody>
                  <DrawerFooter className={styles.drawerFooter}>
                    <Button
                      color="primary"
                      onPress={onClose}
                      className={styles.addButtonStyled}
                      endContent={
                        <Image
                          src="/icons/check.svg"
                          alt="plus"
                          width={24}
                          height={24}
                          priority
                        />
                      }
                    >
                      Создать счет
                    </Button>
                  </DrawerFooter>
                </div>
              )}
            </DrawerContent>
          </Drawer>
        </div>
      )}
    </div>
  );
}
