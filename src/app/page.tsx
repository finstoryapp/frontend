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
import { IExpensesAmount } from "@/types/IExpensesAmount";

export default function Me() {
  const dispatch = useDispatch();
  const { userData, loading } = useSelector((state: RootState) => state.user);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [date, setDate] = useState(() => {
    const currentDate = new Date();
    return {
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
      isPrevious: false,
    };
  });
  const [accounts, setAccounts] = useState<IExpensesAmount[]>();
  const [expenses, setExpenses] = useState<IExpense[] | null>(null);
  const [sum, setSum] = useState<number>(0);
  const [currentAccountIndex, setCurrentAccountIndex] = useState<number>(0); // Track the current account

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

  function aggregateAccounts(data: IExpense[] | null): IExpensesAmount[] {
    if (!data) {
      return [];
    }

    const result: Record<string, IExpensesAmount> = {};
    data.forEach((item) => {
      const { account } = item;
      const { accountName, currency, accountId } = account || {};
      const amount = parseFloat(item.amount);

      if (!accountName || !currency || !accountId || isNaN(amount)) {
        console.warn(`Invalid data in expense:`, item);
        return;
      }

      if (!result[accountId]) {
        result[accountId] = {
          accountName,
          currency,
          accountId,
          sum: 0,
        };
      }

      result[accountId].sum += amount;
    });

    return Object.values(result);
  }

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
  }, [dispatch]);

  useEffect(() => {
    setCurrentAccountIndex(0);
    async function updateExpenses() {
      try {
        const { start, end } = getUnixMonthStartEnd(date.year, date.month + 1);

        const expensesData = await fetchUtil(
          `api/expenses_list/range?from=${start}&to=${end}`
        );

        setExpenses(expensesData);

        const aggregatedAccounts = aggregateAccounts(expensesData);
        setAccounts(aggregatedAccounts);
        const convertedSums = await Promise.all(
          aggregatedAccounts.map(async (item) => {
            try {
              const response = await fetch(
                `https://exchange.ilyadev.tech/get?from=${item.currency}&to=${
                  userData?.defaultCurrency ?? "USD"
                }`
              );

              if (!response.ok) {
                throw new Error(
                  `Currency conversion failed: ${response.statusText}`
                );
              }

              const { rate } = await response.json();
              return item.sum * rate;
            } catch (error) {
              console.error(
                `Error converting currency for account ${item.accountId}:`,
                error
              );
              return 0;
            }
          })
        );

        const totalSum = convertedSums.reduce((acc, sum) => acc + sum, 0);
        setSum(+totalSum.toFixed(2));
      } catch (error) {
        console.error("Error updating expenses:", error);
      }
    }

    updateExpenses();
  }, [date, userData]);

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

  return (
    <>
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
            {expenses ? -1 * sum : "~"}{" "}
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
          <>
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
                        {-1 * accounts[currentAccountIndex]?.sum}{" "}
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
                  let currentAccountId = 0;
                  if (accounts && accounts?.length > 0) {
                    currentAccountId = +accounts[currentAccountIndex].accountId;
                  }

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
                  ) : null; // Return null if the condition is false (you can use null instead of "")
                })}
            </div>
          </>
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
            console.log(currentAccountIndex);
            onOpen();
          }}
          className={styles.addButtonStyled}
          endContent={
            <Image src="/icons/plus.svg" alt="plus" width={24} height={24} />
          }
        >
          Добавить расход
        </Button>
      </div>{" "}
      <Drawer isOpen={isOpen} placement={"bottom"} onOpenChange={onOpenChange}>
        <DrawerContent className={styles.drawer}>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                Добавить расход в счет
              </DrawerHeader>
              <DrawerBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat
                  consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
                  incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                  aliqua enim laboris do dolor eiusmod.
                </p>
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
