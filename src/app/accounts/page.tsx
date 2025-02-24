"use client";
import styles from "./accounts.module.css";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from "@nextui-org/react";

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

  //! STATES

  const [currentSelectedCurrency, setCurrentSelectedCurrency] =
    useState<string>(userData?.defaultCurrency ?? "USD");
  const [currentAddingSelectedCurrency, setCurrentAddingSelectedCurrency] =
    useState<string>("USD");
  const [currentAccountName, setCurrentAccountName] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isAccountExist, setIsAccountExist] = useState<boolean>(false);
  const [isModalRemoveAccountOpen, setIsModalRemoveAccountOpen] =
    useState<boolean>(false);
  const [removingAccountId, setRemovingAccountId] = useState<number>(-1);

  //! FUNSTIONS
  const handleAddClick = () => {
    onOpen();
    setIsAccountExist(false);
    accounts.forEach((element) => {
      console.log(element.id);
    });
  };

  //! ASYNC FUNCTIONS
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
      setCurrentSelectedCurrency(userData?.defaultCurrency ?? "USD");
    } catch (err) {
      console.log(err instanceof Error ? err.message : "An error occurred");
    }
  }
  async function handlePress(onClose: () => void) {
    if (currentAccountName.length !== 0) {
      const accountData = {
        accountName: currentAccountName,
        currency: currentAddingSelectedCurrency, // Исправлено
      };

      setIsSending(true);

      try {
        const response = await fetchUtil("api/add_account", {
          method: "POST",
          body: JSON.stringify(accountData),
        });

        if (!response.ok) {
          setIsAccountExist(true);
        }

        console.log("Успешный ответ:", response);
        setCurrentAccountName("");
        setCurrentAddingSelectedCurrency("USD"); // Сброс на значение по умолчанию
        onClose();
      } catch (error) {
        setIsAccountExist(true);
        console.log("Ошибка сети или обработки:", error);
      } finally {
        fetchAccounts();
        setIsSending(false);
      }
    }
  }
  async function removeAccount(id: number) {
    if (id !== -1) {
      try {
        const response = await fetchUtil(`api/delete_account/${id}`, {
          method: "DELETE",
        });
        if (response.message) {
          setRemovingAccountId(-1);
          console.log("Account deleted successfully!");
          fetchAccounts();
          return "Deleted";
        } else {
          setRemovingAccountId(-1);
          console.error(response);
        }
      } catch (error) {
        console.log(error);
        setRemovingAccountId(-1);
      }
    } else {
      return "Error";
    }
  }
  async function updateCurrency(currency: string) {
    try {
      await fetchUtil("api/update_default_currency", {
        method: "PUT",
        body: JSON.stringify({ currency: currency }),
      });
    } catch (err) {
      console.log(err);
    }
  }

  //! REFS
  const currenciesContainerRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const scrollLeft = useRef<number>(0);
  //! DRAG CURRENCIES
  const handleMouseDown = (e: React.MouseEvent) => {
    if (currenciesContainerRef.current) {
      isDragging.current = true;
      startX.current = e.clientX;
      scrollLeft.current = currenciesContainerRef.current.scrollLeft;
    }
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !currenciesContainerRef.current) return;
    const x = e.clientX;
    const walk = (x - startX.current) * 1;
    currenciesContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };
  const handleMouseUp = () => {
    isDragging.current = false;
  };
  const handleMouseLeave = () => {
    isDragging.current = false;
  };
  const handleWheel = (e: React.WheelEvent) => {
    if (currenciesContainerRef.current) {
      const delta = e.deltaY;
      currenciesContainerRef.current.scrollLeft += delta;
    }
  };

  //! REFS FOR DEFAULT CURRENCY
  const currenciesContainerRefDefault = useRef<HTMLDivElement | null>(null);
  const isDraggingDefault = useRef<boolean>(false);
  const startXDefault = useRef<number>(0);
  const scrollLeftDefault = useRef<number>(0);
  //! DRAG DEFAULTS
  const handleMouseDownDefault = (e: React.MouseEvent) => {
    if (currenciesContainerRefDefault.current) {
      isDraggingDefault.current = true;
      startXDefault.current = e.clientX;
      scrollLeftDefault.current =
        currenciesContainerRefDefault.current.scrollLeft;
    }
  };
  const handleMouseMoveDefault = (e: React.MouseEvent) => {
    if (!isDraggingDefault.current || !currenciesContainerRefDefault.current)
      return;
    const x = e.clientX;
    const walk = (x - startXDefault.current) * 1;
    currenciesContainerRefDefault.current.scrollLeft =
      scrollLeftDefault.current - walk;
  };
  const handleMouseUpDefault = () => {
    isDraggingDefault.current = false;
  };
  const handleMouseLeaveDefault = () => {
    isDraggingDefault.current = false;
  };
  const handleWheelDefault = (e: React.WheelEvent) => {
    if (currenciesContainerRefDefault.current) {
      const delta = e.deltaY;
      currenciesContainerRefDefault.current.scrollLeft += delta;
    }
  };
  //! EFFECTS
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
              Основная валюта - {currentSelectedCurrency}
            </p>
            <div
              className={styles.defaultCurrencyChoice}
              ref={currenciesContainerRefDefault}
              onMouseDown={handleMouseDownDefault}
              onMouseMove={handleMouseMoveDefault}
              onMouseUp={handleMouseUpDefault}
              onMouseLeave={handleMouseLeaveDefault}
              onWheel={handleWheelDefault}
            >
              {[
                userData?.defaultCurrency,
                ...currencies.filter(
                  (currency) => currency !== userData?.defaultCurrency
                ),
              ].map((currency, index) => {
                return (
                  <span
                    onClick={() => {
                      setCurrentSelectedCurrency(currency ?? "");
                      updateCurrency(String(currency));
                    }}
                    className={`${styles.currencyItem} ${
                      currentSelectedCurrency === currency
                        ? styles.selectedCurrency
                        : ""
                    } ${
                      currency === userData?.defaultCurrency
                        ? styles.defaultCurrency
                        : ""
                    }`}
                    key={`${currency}-${index}`} // Уникальный ключ
                  >
                    {currency}
                  </span>
                );
              })}
            </div>
          </div>
          <div className={styles.accountsList}>
            {accounts.map((account) => (
              <div key={account.id} className={styles.accountItem}>
                <div className={styles.accountItemHeader}>
                  <p>{account.accountName}</p>
                  {accounts.length !== 1 ? (
                    <button
                      onClick={() => {
                        setRemovingAccountId(+account.id);
                        setIsModalRemoveAccountOpen(true);
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
                        setCurrentAddingSelectedCurrency("USD");
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
                      <input
                        type="text"
                        maxLength={20}
                        value={currentAccountName}
                        onChange={(e) => {
                          setCurrentAccountName(e.target.value);
                          setIsAccountExist(false);
                        }}
                      />
                      {isAccountExist ? (
                        <p className={styles.accountError}>
                          Такой аккаунт уже есть
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div
                      className={styles.accountCurrency}
                      ref={currenciesContainerRef}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseLeave}
                      onWheel={handleWheel}
                    >
                      {currencies.map((currency) => {
                        return (
                          <span
                            onClick={() => {
                              setCurrentAddingSelectedCurrency(currency);
                            }}
                            className={`${styles.currencyItem} ${
                              currentAddingSelectedCurrency === currency
                                ? styles.selectedCurrency
                                : ""
                            }`}
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
                      {isSending ? "" : "Создать счет"}
                    </Button>
                  </DrawerFooter>
                </div>
              )}
            </DrawerContent>
          </Drawer>{" "}
          <Modal
            isOpen={isModalRemoveAccountOpen}
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
                    <p>Удалить счет?</p>
                    <p className={styles.warning}>
                      Удалятся все связанные расходы
                    </p>
                  </ModalHeader>
                  <ModalFooter className={styles.removeModalFooter}>
                    <Button
                      color="primary"
                      onPress={() => {
                        setIsModalRemoveAccountOpen(false);
                      }}
                    >
                      Отменить
                    </Button>
                    <Button
                      color="danger"
                      onPress={() => {
                        removeAccount(removingAccountId);
                        setIsModalRemoveAccountOpen(false);
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
      )}
    </div>
  );
}
