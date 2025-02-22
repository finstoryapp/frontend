"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import styles from "./statistics.module.css";
import { fetchUtil } from "@/utils/utilFetch";
import { IExpense } from "@/types/IExpense";
import { getUnixMonthStartEnd } from "@/utils/getUnixMonthStartEnd";

interface CategorySum {
  name: string;
  value: number;
  color: string;
}

export default function Statistics() {
  const { userData } = useSelector((state: RootState) => state.user);
  const { accounts } = useSelector((state: RootState) => state.accounts);
  const [expenses, setExpenses] = useState<IExpense[] | null>(null);
  const [categorySums, setCategorySums] = useState<CategorySum[]>([]);
  const [totalSum, setTotalSum] = useState(0);
  const [currentAccountIndex, setCurrentAccountIndex] = useState(-1);
  const [currentDate, setCurrentDate] = useState(new Date());
  console.log(expenses);
  const currentAccount =
    currentAccountIndex === -1
      ? { accountName: "Все счета", currency: userData?.defaultCurrency }
      : accounts[currentAccountIndex];

  // Вспомогательная функция для нормализации цвета
  const normalizeColor = (color?: string): string => {
    if (!color) return "#cccccc";
    // Если цвет уже с # и валидный HEX
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) return color;
    // Если цвет без #, но валидный HEX
    if (/^[0-9A-Fa-f]{6}$/.test(color)) return `#${color}`;
    return "#cccccc"; // запасной цвет для всех некорректных случаев
  };

  const handlePrevAccount = () => {
    setCurrentAccountIndex((prev) =>
      prev <= -1 ? accounts.length - 1 : prev - 1
    );
  };

  const handleNextAccount = () => {
    setCurrentAccountIndex((prev) =>
      prev >= accounts.length - 1 ? -1 : prev + 1
    );
  };

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    const nextDate = new Date(currentDate);
    nextDate.setMonth(currentDate.getMonth() + 1);
    if (nextDate <= new Date()) {
      setCurrentDate(nextDate);
    }
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleString("ru-RU", { month: "long", year: "numeric" });
  };
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const { start, end } = getUnixMonthStartEnd(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1
        );
        const expenses: IExpense[] = await fetchUtil(
          `api/expenses_list/range?from=${start}&to=${end}`
        );
        setExpenses(expenses);

        const sums: { [key: string]: number } = {};
        let total = 0;

        const filteredExpenses =
          currentAccountIndex === -1
            ? expenses
            : expenses.filter(
                (exp) =>
                  exp.accountId === accounts[currentAccountIndex].accountId
              );

        for (const expense of filteredExpenses) {
          let amount = Math.abs(Number(expense.amount));

          if (
            currentAccountIndex === -1 &&
            expense.account.currency !== userData?.defaultCurrency
          ) {
            try {
              const response = await fetch(
                `https://exchange.ilyadev.tech/get?from=${expense.account.currency}&to=${userData?.defaultCurrency}`
              );
              const exchangeRate = await response.json();
              amount *= exchangeRate.rate;
            } catch (error) {
              console.error("Error converting currency:", error);
            }
          }

          sums[expense.categoryName] =
            (sums[expense.categoryName] || 0) + amount;
          total += amount;
        }

        // Явное сопоставление цветов с категориями
        const categoryData = Object.entries(sums).map(([name, value]) => {
          const category = userData?.categories.find(
            (cat) => cat.name === name
          );
          // Определим цвета явно для тестирования (можно заменить на данные из userData)
          const colorMap: { [key: string]: string } = {
            Транспорт: "#F3E092", // Желтый для Транспорта
            Еда: "#4DB748", // Зеленый для Еды
            // Добавьте другие категории по необходимости
          };
          const defaultColor = "#cccccc"; // Запасной цвет
          return {
            name,
            value,
            color: normalizeColor(
              colorMap[name] || category?.color || defaultColor
            ),
          };
        });

        setCategorySums(categoryData);
        setTotalSum(total);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    if (userData && accounts) {
      fetchExpenses();
    }
  }, [userData, accounts, currentAccountIndex, currentDate]);
  return (
    <div className={styles.container}>
      <div className={styles.monthSwitcher}>
        <button onClick={handlePrevMonth}>
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
        <span className={styles.monthName}>{formatMonth(currentDate)}</span>
        <button
          onClick={handleNextMonth}
          disabled={
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear()
          }
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
      </div>

      <div className={styles.accountSwitcher}>
        <button onClick={handlePrevAccount}>
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
        <span className={styles.accountName}>
          {currentAccount?.accountName}
        </span>
        <button onClick={handleNextAccount}>
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

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categorySums}
              cx="50%"
              cy="50%"
              innerRadius={120}
              outerRadius={150}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              animationDuration={400}
              isAnimationActive={false}
            >
              {categorySums.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.totalSum}>
          <span className={styles.sumLabel}>Расход за месяц</span>
          <span className={styles.sumValue}>
            {totalSum.toFixed(2)} {currentAccount?.currency}
          </span>
        </div>
      </div>

      <div className={styles.legendContainer}>
        {categorySums
          .sort((a, b) => b.value - a.value)
          .map((category, index) => (
            <div key={index} className={styles.legendItem}>
              <div
                className={styles.colorIndicator}
                style={{ backgroundColor: category.color }}
              />
              <span className={styles.categoryName}>{category.name}</span>
              <span className={styles.categoryValue}>
                {category.value.toFixed(2)}{" "}
                <span>{currentAccount?.currency}</span>
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
