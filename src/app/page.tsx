"use client";
import { retrieveLaunchParams } from "@telegram-apps/sdk";
import { useEffect, useRef, useState } from "react";
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
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from "@nextui-org/react";
import styles from "./main.module.css";

import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import { RootState } from "@/store/store";
import { getUnixMonthStartEnd } from "@/utils/getUnixMonthStartEnd";
import { IExpense } from "@/types/IExpense";
import { setAccounts } from "@/store/slices/accountsSlice";
import { IFullSumAccumulator } from "@/types/IFullSumAccumulator";
import { IUser } from "@/store/slices/userSlice";
import { getWeekDays } from "@/utils/getWeekDays";
import { IAccount } from "@/types/IAccount";

export default function Me() {
  const dispatch = useDispatch();
  const { userData, loading } = useSelector((state: RootState) => state.user);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { accounts } = useSelector((state: RootState) => state.accounts);
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

  //! COMPONENT's STATES
  const [date, setDate] = useState(() => {
    const currentDate = new Date();
    return {
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
      isPrevious: false,
    };
  });
  const [expenses, setExpenses] = useState<IExpense[] | null>(null);
  const [currentAccountSum, setCurrentAccountSum] = useState<number>(0);
  const [currentAccountIndex, setCurrentAccountIndex] = useState<number>(0);
  const [fullSum, setFullSum] = useState<number>(0);
  const [isModalRemoveExpenseOpen, setIsModalRemoveExpenseOpen] =
    useState<boolean>(false);
  const [currentExpenseId, setCurrentExpenseId] = useState<number>(-1);
  const [currentSelectedDayIndex, setCurrentSelectedDayIndex] =
    useState<number>(4);
  const [clickedCategory, setClickedCategory] = useState<string | null>(null);
  const [expenseValue, setExpenseValue] = useState<number | string>("");
  const [emptyCategoryError, setEmptyCategoryError] = useState<boolean>(false);
  const [emptyValueError, setEmptyValueError] = useState<boolean>(false);
  const [isSending, setIsSending] = useState(false);

  //! FUNCTIONS
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
  const handleCategoryClick = (categoryName: string) => {
    setEmptyCategoryError(false);
    setClickedCategory(categoryName);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.valueAsNumber;
    setEmptyValueError(false);
    if (inputValue < 0) {
      setExpenseValue(0);
    } else if (inputValue > 100000000) {
      setExpenseValue(100000000);
    } else {
      setExpenseValue(inputValue || "");
    }
  };
  const handleFocus = () => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 300);
  };

  //! ASYNC FUNCTIONS
  async function removeExpense(id: number) {
    if (id !== -1) {
      try {
        const response = await fetchUtil(`api/delete_expense/${id}`, {
          method: "DELETE",
        });
        if (response.message) {
          setCurrentExpenseId(-1);
          console.log("Expense deleted successfully!");
          fetchAccounts();
          fetchExpenses();
          return "Deleted";
        } else {
          setCurrentExpenseId(-1);
          console.error(response);
        }
      } catch (error) {
        console.log(error);
        setCurrentExpenseId(-1);
      }
    } else {
      return "Error";
    }
  }
  async function updateExpenses() {
    const { start, end } = getUnixMonthStartEnd(date.year, date.month + 1);
    const expensesData = await fetchUtil(
      `api/expenses_list/range?from=${start}&to=${end}`
    );
    setExpenses(expensesData);

    if (expensesData && accounts.length !== 0) {
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
  async function fetchAccounts() {
    const accounts: IAccount[] = await fetchUtil("api/accounts_list", {
      method: "GET",
    });
    if (accounts) dispatch(setAccounts(accounts));
  }
  async function fetchExpenses() {
    const { start, end } = getUnixMonthStartEnd(date.year, date.month + 1);

    const expensesData = await fetchUtil(
      `api/expenses_list/range?from=${start}&to=${end}`
    );
    console.log(expensesData);
    setExpenses(expensesData);

    const fullSumAccumulator: IFullSumAccumulator[] = [];
    let fullSumResult: number = 0;

    expensesData.forEach((expense: IExpense) => {
      const foundCurrency = fullSumAccumulator.find(
        (element) => element.currency === expense.account.currency
      );

      if (!foundCurrency) {
        fullSumAccumulator.push({
          currency: expense.account.currency,
          amount: +expense.amount,
        });
      } else {
        foundCurrency.amount += +expense.amount;
      }
    });
    if (!userData?.defaultCurrency) {
      setFullSum(0);
    } else {
      for (const item of fullSumAccumulator) {
        if (item.currency === userData?.defaultCurrency) {
          fullSumResult += item.amount;
        } else {
          try {
            const response = await fetch(
              `https://exchange.ilyadev.tech/get?from=${item.currency}&to=${userData?.defaultCurrency}`
            );
            const exchangeRate = await response.json();
            fullSumResult += item.amount * exchangeRate.rate;
          } catch (error) {
            console.error("Error fetching exchange rate:", error);
          }
        }
      }
    }
    setFullSum(+fullSumResult.toFixed(2));
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
      fetchExpenses();
      dispatch(setUser(userData));
    } catch (err) {
      console.log(err instanceof Error ? err.message : "An error occurred");
    }
  }
  const handlePress = async (onClose: () => void) => {
    if (clickedCategory && +expenseValue !== 0) {
      const expenseData = {
        amount: expenseValue,
        accountId: +accounts[currentAccountIndex]?.accountId,
        categoryName: clickedCategory,
        time: getWeekDays().reverse()[currentSelectedDayIndex].unix,
      };

      setIsSending(true);

      try {
        const response = await fetchUtil("api/add_expense", {
          method: "POST",
          body: JSON.stringify(expenseData),
        });

        console.log("Данные успешно отправлены", response);
        onClose();
      } catch (error) {
        console.error("Ошибка при отправке данных:", error);
      } finally {
        fetchAccounts();
        fetchExpenses();
        setIsSending(false);
        setClickedCategory(null);
        setCurrentSelectedDayIndex(4);
        setEmptyCategoryError(false);
        setExpenseValue("");
      }
    } else {
      if (!clickedCategory) {
        setEmptyCategoryError(true);
      }
      if (+expenseValue <= 0) {
        setEmptyValueError(true);
      }
    }
  };

  //! EFFECTS
  useEffect(() => {
    initializeUser();
  }, [date]);

  useEffect(() => {
    if (userData) {
      fetchExpenses();
    }
  }, [userData]);

  useEffect(() => {
    fetchAccounts();
  }, [userData]);

  useEffect(() => {
    updateExpenses();
  }, [currentAccountIndex, date, accounts]);

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.onfocus = () => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
      };
    }

    return () => {
      if (inputElement.current) {
        inputElement.current.onfocus = null;
      }
    };
  }, []);

  const categoriesContainerRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const scrollLeft = useRef<number>(0);
  const inputElement = useRef<HTMLInputElement | null>(null);

  //! DRAG CATEGORIES
  const handleMouseDown = (e: React.MouseEvent) => {
    if (categoriesContainerRef.current) {
      isDragging.current = true;
      startX.current = e.clientX;
      scrollLeft.current = categoriesContainerRef.current.scrollLeft;
    }
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !categoriesContainerRef.current) return;
    const x = e.clientX;
    const walk = (x - startX.current) * 1;
    categoriesContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };
  const handleMouseUp = () => {
    isDragging.current = false;
  };
  const handleMouseLeave = () => {
    isDragging.current = false;
  };
  const handleWheel = (e: React.WheelEvent) => {
    if (categoriesContainerRef.current) {
      const delta = e.deltaY;
      categoriesContainerRef.current.scrollLeft += delta;
    }
  };

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
            {expenses ? -1 * fullSum : "~"}{" "}
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
                        {-1 * +currentAccountSum.toFixed(3)}{" "}
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
              {/* Проверка на наличие расходов */}
              {expenses && expenses.length ? (
                expenses
                  .filter((expense) => expense?.createdAt)
                  .sort((a, b) => {
                    const dateA = +a.createdAt;
                    const dateB = +b.createdAt;
                    return dateB - dateA;
                  })
                  .map((expense) => {
                    if (
                      !expense.createdAt ||
                      !expense.accountId ||
                      !expense.amount
                    ) {
                      console.error("Invalid expense data:", expense);
                      return null;
                    }

                    const createdAt: number = +expense.createdAt;
                    if (isNaN(createdAt)) {
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

                    // Проверка на существование currentAccountId
                    const currentAccount =
                      accounts?.[currentAccountIndex] || {};
                    const currentAccountId = +currentAccount.accountId;

                    if (!currentAccountId || isNaN(currentAccountId)) {
                      console.error(
                        "Invalid current account ID:",
                        currentAccountId
                      );
                      return null;
                    }

                    // Проверка на соответствие accountId расходов
                    if (currentAccountId !== +expense.accountId) {
                      return null;
                    }

                    // Получение категории и цвета
                    const category = userData?.categories?.find(
                      (category) => category.name === expense.categoryName
                    );
                    const categoryColor = category?.color || "cccccc"; // Используем дефолтный цвет, если категория не найдена

                    return (
                      <div className={styles.expenseItem} key={expense.id}>
                        <p className={styles.expenseItemDate}>
                          {`${date.getDate()} ${day}`}
                        </p>
                        <p className={styles.expenseItemAmount}>
                          {Math.round(+expense.amount * -1000) / 1000}
                        </p>
                        <div className={styles.expenseItemCategory}>
                          <div
                            className={styles.expenseItemCategoryCircle}
                            style={{
                              backgroundColor: `#${categoryColor}`,
                            }}
                          ></div>
                          <span>{expense.categoryName}</span>
                        </div>
                        <button
                          className={styles.expenseItemButton}
                          onClick={() => {
                            setIsModalRemoveExpenseOpen(true);
                            setCurrentExpenseId(+expense.id);
                          }}
                        >
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
                    );
                  })
              ) : (
                <p>Добавляйте расходы и они появятся.</p>
              )}
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
            if (accounts.length === 0) {
              fetchAccounts();
            }
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
              <DrawerHeader className="flex gap-1 pb-0">
                <button
                  onClick={() => {
                    setIsSending(false);
                    setClickedCategory(null);
                    setCurrentSelectedDayIndex(4);
                    setEmptyCategoryError(false);
                    setExpenseValue("");
                    onClose();
                  }}
                  className={styles.closeButton}
                >
                  <img src="/icons/close.svg" alt="close" />
                </button>
                Добавить расход
              </DrawerHeader>
              <DrawerBody className={styles.drawerBody}>
                <div className={styles.drawerHeader}>
                  <span className={styles.drawerHeaderAccount}>
                    {accounts[currentAccountIndex]?.accountName}
                  </span>
                  <div>
                    <span className={styles.drawerHeaderSum}>
                      {-1 * +currentAccountSum.toFixed(3)}{" "}
                    </span>
                    <span className={styles.drawerHeaderCurrency}>
                      {accounts[currentAccountIndex]?.currency}
                    </span>
                  </div>
                </div>
                <div className={styles.tabs}>
                  {getWeekDays()
                    .reverse()
                    .map((day, index) => (
                      <span
                        key={day.unix}
                        className={
                          index === currentSelectedDayIndex
                            ? styles.activeTab
                            : ""
                        }
                        onClick={() => setCurrentSelectedDayIndex(index)}
                      >
                        {day.date}
                      </span>
                    ))}
                </div>
                <div className={styles.categories}>
                  <div
                    ref={categoriesContainerRef}
                    className={styles.categoriesContainer}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onWheel={handleWheel}
                  >
                    {userData?.categories.map((category) => (
                      <span
                        onClick={() => {
                          handleCategoryClick(category.name);
                        }}
                        className={`${styles.categoryItem} ${
                          clickedCategory === category.name
                            ? styles.clicked
                            : ""
                        }`}
                        key={category.name}
                      >
                        {category.name}
                        <div
                          className={styles.categoryCircle}
                          style={{ backgroundColor: `#${category.color}` }}
                        ></div>
                      </span>
                    ))}
                  </div>
                </div>
                {emptyCategoryError && <>Нужно выбрать категорию</>}
                <div className={styles.inputExpenseContainer}>
                  <input
                    ref={inputElement}
                    type="number"
                    placeholder="0"
                    value={expenseValue}
                    onChange={handleChange}
                    className={styles.inputExpense}
                    max={10000000}
                    onFocus={handleFocus}
                    inputMode="decimal"
                    aria-describedby="amount"
                  />
                </div>
                {emptyValueError ? <>Нужно ввести расход</> : ""}
              </DrawerBody>
              <DrawerFooter className={styles.drawerFooter}>
                <Button
                  color="primary"
                  onPress={() => handlePress(onClose)}
                  className={styles.addButtonStyled}
                  endContent={
                    isSending ? (
                      <Spinner color="white" />
                    ) : (
                      <Image
                        src="/icons/check.svg"
                        alt="check"
                        width={24}
                        height={24}
                      />
                    )
                  }
                >
                  {isSending ? "" : "Добавить расход"}
                </Button>
              </DrawerFooter>
            </div>
          )}
        </DrawerContent>
      </Drawer>
      <Modal
        isOpen={isModalRemoveExpenseOpen}
        className="dark w-52"
        backdrop="blur"
        placement="center"
        hideCloseButton
        disableAnimation
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader
                className={`flex flex-col gap-1 ${styles.removeModalHeader}`}
              >
                Удалить запись?
              </ModalHeader>
              <ModalFooter className={styles.removeModalFooter}>
                <Button
                  color="primary"
                  onPress={() => {
                    setIsModalRemoveExpenseOpen(false);
                  }}
                >
                  Отменить
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    removeExpense(currentExpenseId);
                    setIsModalRemoveExpenseOpen(false);
                  }}
                >
                  Удалить
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
