"use client";
import { retrieveLaunchParams } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";
import { fetchUtil } from "../utils/utilFetch";
import { Spinner } from "@nextui-org/react";

import { Button } from "@nextui-org/button";
import Image from "next/image";

import styles from "./main.module.css";

import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import { RootState } from "@/store/store";
import { getUnixMonthStartEnd } from "@/utils/getUnixMonthStartEnd";
import { IExpense } from "@/types/IExpense";
import { IExpensesAmount } from "@/types/IExpensesAmount";

export default function Me() {
  const dispatch = useDispatch();
  const [date, setDate] = useState(() => {
    const currentDate = new Date();
    return {
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
      isPrevious: false,
    };
  });

  const { userData, loading } = useSelector((state: RootState) => state.user);
  const [expenses, setExpenses] = useState<IExpense[] | null>(null);
  const [sum, setSum] = useState<number>(0);
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
    // Типизируем result как объект с ключами-строками и значениями типа IExpensesAmount
    const result: Record<string, IExpensesAmount> = {};

    data?.forEach((item) => {
      const { accountName, currency, accountId } = item.account;
      const amount = parseFloat(item.amount);

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
    async function updateExpenses() {
      try {
        const { start, end } = getUnixMonthStartEnd(date.year, date.month + 1);

        // Запрос данных о расходах
        const expensesData = await fetchUtil(
          `api/expenses_list/range?from=${start}&to=${end}`
        );

        setExpenses(expensesData);

        const aggregatedAccounts = aggregateAccounts(expensesData);
        console.log(aggregatedAccounts);
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
            {expenses ? sum : "~"}{" "}
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
          <div className={styles.accountWrapper}>
            <button
              className={styles.accountWrapperLeftBtn}
              style={{ visibility: "hidden" }}
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
            <div className={styles.accountWrapperBox}>
              <p className={styles.accountWrapperBoxName}>MyBank</p>
              <p className={styles.accountWrapperBoxValue}>
                -1275 <span>USD</span>
              </p>
            </div>
            <button className={styles.accountWrapperRightBtn}>
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
        )}
      </div>
      <div className={styles.addButton}>
        <Button
          color="primary"
          onPress={() => {
            console.log(userData?.defaultCurrency ?? "");
            console.log(expenses);
            console.log(date);
          }}
          className={styles.addButtonStyled}
          endContent={
            <Image src="/icons/plus.svg" alt="plus" width={24} height={24} />
          }
        >
          Добавить расход
        </Button>
      </div>
    </>
  );
}
