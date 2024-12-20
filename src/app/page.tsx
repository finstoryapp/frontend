"use client";
import { retrieveLaunchParams } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";
import { fetchUtil } from "../utils/utilFetch";
import { Spinner, useDisclosure } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@nextui-org/drawer";
import styles from "./main.module.css";

import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import { RootState } from "@/store/store";
import { getUnixMonthStartEnd } from "@/utils/getUnixMonthStartEnd";
import { IExpense } from "@/types/IExpense";
import { setAccounts } from "@/store/slices/accountsSlice";

export default function Me() {
  const dispatch = useDispatch();
  const { userData, loading } = useSelector((state: RootState) => state.user);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { accounts } = useSelector((state: RootState) => state.accounts);

  const [date, setDate] = useState(() => {
    const currentDate = new Date();
    return {
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
      isPrevious: false,
    };
  });
  const [expenses, setExpenses] = useState<IExpense[] | null>(null);

  const russianMonths = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  function goPrevMonth() {
    setDate((prevDate) => {
      const prevMonth = prevDate.month === 0 ? 11 : prevDate.month - 1;
      const prevYear = prevDate.month === 0 ? prevDate.year - 1 : prevDate.year;
      const isPrevious = true;

      return { ...prevDate, month: prevMonth, year: prevYear, isPrevious };
    });
  }
  function goNextMonth() {
    setDate((prevDate) => {
      const nextMonth = prevDate.month === 11 ? 0 : prevDate.month + 1;
      const nextYear =
        prevDate.month === 11 ? prevDate.year + 1 : prevDate.year;
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const isPrevious = !(
        nextMonth === currentMonth && nextYear === currentYear
      );

      return { ...prevDate, month: nextMonth, year: nextYear, isPrevious };
    });
  }

  const [currentAccountSum, setCurrentAccountSum] = useState<number>(0);
  const [currentAccountIndex, setCurrentAccountIndex] = useState<number>(0);
  const handlePrevAccount = () => {
    if (currentAccountIndex > 0) {
      setCurrentAccountIndex(currentAccountIndex - 1);
    }
  };

  const handleNextAccount = () => {
    if (accounts && currentAccountIndex < accounts.length - 1) {
      setCurrentAccountIndex(currentAccountIndex + 1);
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonthIndex = currentDate.getMonth();

    const currentEndStart = getUnixMonthStartEnd(
      currentYear,
      currentMonthIndex + 1
    );

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

        const expensesData = await fetchUtil(
          `api/expenses_list/range?from=${currentEndStart.start}&to=${currentEndStart.end}`
        );
        setExpenses(expensesData);
        dispatch(setUser(userData));
      } catch (err) {
        console.log(err instanceof Error ? err.message : "An error occurred");
      }
    }

    initializeUser();
  }, []);

  useEffect(() => {
    async function fetchAccounts() {
      const accounts = await fetchUtil("api/accounts_list", {
        method: "GET",
      });
      dispatch(setAccounts(accounts));
    }
    fetchAccounts();
  }, [dispatch]);

  useEffect(() => {
    async function updateExpenses() {
      const { start, end } = getUnixMonthStartEnd(date.year, date.month + 1);
      const expensesData = await fetchUtil(
        `api/expenses_list/range?from=${start}&to=${end}`
      );
      setExpenses(expensesData);

      if (expensesData && accounts.length !== 0) {
        console.log("Expenses:", expensesData);
        console.log(accounts[currentAccountIndex]);
        // Count sum for CURRENT account from CURRENT MONTH expenses
        const accountSum = expensesData.reduce(
          (accumulator: number, currentValue: IExpense) => {
            if (
              accounts[currentAccountIndex].accountId === currentValue.accountId
            ) {
              return accumulator + +currentValue.amount;
            } else {
              return accumulator;
            }
          },
          0
        );
        setCurrentAccountSum(accountSum);
      }
    }
    updateExpenses();
  }, [currentAccountIndex, date, accounts]);

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.month}>
          <button className={styles.prevMonthBtn} onClick={() => goPrevMonth()}>
            {" "}
            <svg
              width="10"
              height="18"
              viewBox="0 0 10 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.75 1.5L1.25 9L8.75 16.5"
                stroke="#3E9FFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <p className={styles.date}>
            {russianMonths[date.month]} {date.year}
          </p>
          <button
            className={styles.nextMonthBtn}
            style={date.isPrevious ? {} : { visibility: "hidden" }}
            onClick={() => goNextMonth()}
          >
            {" "}
            <svg
              width="10"
              height="18"
              viewBox="0 0 10 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.75 1.5L1.25 9L8.75 16.5"
                stroke="#3E9FFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className={styles.sum}>
          <p className={styles.sumText}>Расход за месяц</p>
          <p className={styles.sumValue}>
            {expenses ? -1 * 0 : "~"}{" "}
            <span className={styles.sumCurrency}>
              {userData?.defaultCurrency ?? "..."}
            </span>
          </p>
        </div>
      </div>
      <div className={styles.container}>
        {loading ? (
          <div className={styles.loading}>
            <Spinner />
          </div>
        ) : (
          <div>
            <div className={styles.accountWrapper}>
              {accounts?.length === 0 ? (
                <span className={styles.accountNoAccount}>
                  За этот месяц записей нет.
                </span>
              ) : (
                accounts &&
                accounts.length > 0 && (
                  <>
                    {accounts.length > 1 && (
                      <button
                        className={styles.accountWrapperLeftBtn}
                        onClick={handlePrevAccount}
                        style={
                          currentAccountIndex === 0
                            ? { visibility: "hidden" }
                            : {}
                        }
                        disabled={currentAccountIndex === 0}
                      >
                        <svg
                          width="10"
                          height="18"
                          viewBox="0 0 10 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.75 1.5L1.25 9L8.75 16.5"
                            stroke="#3E9FFF"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    )}
                    <div className={styles.accountWrapperBox}>
                      <p className={styles.accountWrapperBoxName}>
                        {accounts[currentAccountIndex]?.accountName}
                      </p>
                      <p className={styles.accountWrapperBoxValue}>
                        {-1 * currentAccountSum}{" "}
                        <span>{accounts[currentAccountIndex]?.currency}</span>
                      </p>
                    </div>
                    {accounts.length > 1 && (
                      <button
                        className={styles.accountWrapperRightBtn}
                        onClick={handleNextAccount}
                        style={
                          currentAccountIndex === accounts.length - 1
                            ? { visibility: "hidden" }
                            : {}
                        }
                        disabled={currentAccountIndex === accounts.length - 1}
                      >
                        <svg
                          width="10"
                          height="18"
                          viewBox="0 0 10 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.75 1.5L1.25 9L8.75 16.5"
                            stroke="#3E9FFF"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    )}
                  </>
                )
              )}
            </div>
            <div className={styles.expensesContainer}>
              {expenses
                ?.sort((a, b) => {
                  const dateA = +a.createdAt;
                  const dateB = +b.createdAt;
                  return dateB - dateA;
                })
                .map((expense) => {
                  const createdAt: number = +expense.createdAt;
                  if (!createdAt) {
                    console.error("Invalid createdAt:", createdAt);
                    return null;
                  }

                  const date = new Date(createdAt);
                  if (isNaN(date.getTime())) {
                    console.error("Invalid date:", createdAt);
                    return null;
                  }

                  const dayNames = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
                  const day = dayNames[date.getDay()];
                  const currentAccountId =
                    +accounts[currentAccountIndex].accountId;

                  return currentAccountId === +expense.accountId ? (
                    <div className={styles.expenseItem} key={expense.id}>
                      <p className={styles.expenseItemDate}>
                        {`${date.getDate()} ${day}`}
                      </p>
                      <p className={styles.expenseItemAmount}>
                        {-1 * +expense.amount}
                      </p>
                      <div className={styles.expenseItemCategory}>
                        <div
                          className={styles.expenseItemCategoryCircle}
                          style={{
                            backgroundColor: `#${
                              userData?.categories
                                .filter(
                                  (category) =>
                                    category.name === expense.categoryName
                                )
                                .map((category) => category.color)[0]
                            }`,
                          }}
                        ></div>
                        <span>{expense.categoryName}</span>
                      </div>
                      <button className={styles.expenseItemButton}>
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
                  ) : null;
                })}
            </div>
          </div>
        )}
      </div>
      <div className={styles.addButton}>
        <Button
          color="primary"
          onPress={() => {
            console.log(userData?.defaultCurrency ?? "");
            console.log(userData?.categories);
            console.log(expenses);
            console.log(date);
            console.log(accounts);
            onOpen();
          }}
          className={styles.addButtonStyled}
          endContent={
            <Image
              src="/icons/plus.svg"
              alt="plus"
              width={24}
              height={24}
              priority
            />
          }
        >
          Добавить расход
        </Button>
      </div>{" "}
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
              <button onClick={() => onClose()} className={styles.closeButton}>
                <img src="/icons/close.svg" alt="close" />
              </button>
              <DrawerHeader className="flex gap-1 relative">
                Добавить расход
              </DrawerHeader>
              <DrawerBody className={styles.drawerBody}></DrawerBody>
              <DrawerFooter className={styles.drawerFooter}>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose();
                  }}
                  className={styles.addButtonStyled}
                  endContent={
                    <Image
                      src="/icons/check.svg"
                      alt="check"
                      width={24}
                      height={24}
                    />
                  }
                >
                  Добавить расход
                </Button>
              </DrawerFooter>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
