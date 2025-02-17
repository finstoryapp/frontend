"use client";
import { useEffect, useState } from "react";
import styles from "./settings.module.css";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  useDisclosure,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  ModalBody,
} from "@nextui-org/react";
import { fetchUtil } from "@/utils/utilFetch";
import { openLink, init } from "@telegram-apps/sdk";
import { useDispatch, useSelector } from "react-redux";
import { IUser, setUser } from "@/store/slices/userSlice";
import { retrieveLaunchParams } from "@telegram-apps/sdk";
import { RootState } from "@/store/store";
import Image from "next/image";
import { HexColorPicker } from "react-colorful";

export default function Settings() {
  const dispatch = useDispatch();
  const { userData, loading } = useSelector((state: RootState) => state.user);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  //! STATES
  const [isCategoryWindow, setIsCategoryWindow] = useState<boolean>(false);
  const [isModalLoadExcelOpen, setIsModalLoadExcelOpen] =
    useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categoryName, setCategoryName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#4DB748"); // Default color
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colors = [
    "#4DB748",
    "#90E0EF",
    "#F3DFCA",
    "#FF8B59",
    "#9D4EDD",
    "#E4C1F9",
  ];

  console.log(selectedCategory, loading);

  //! ASYNC FUNCTIONS
  async function getExcel() {
    try {
      await fetchUtil("api/get_excel", {
        method: "GET",
      });
    } catch (err) {
      console.log(err);
    }
  }
  //! Load categories
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
      dispatch(setUser(userData));
    } catch (err) {
      console.log(err instanceof Error ? err.message : "An error occurred");
    }
  }
  useEffect(() => {
    initializeUser();
  }, []);

  const handleCreateCategory = async (onClose: () => void) => {
    if (categoryName.trim()) {
      try {
        const response = await fetchUtil("api/add_category", {
          method: "POST",
          body: JSON.stringify({
            name: categoryName,
            color: selectedColor.replace("#", ""),
          }),
        });

        if (response.message) {
          // Refresh user data to get updated categories
          await initializeUser();
          onClose();
          setCategoryName("");
          setSelectedColor("#4DB748");
        }
      } catch (error) {
        console.error("Error creating category:", error);
      }
    }
  };

  // Add custom color picker handler
  const handleCustomColor = (color: string) => {
    setSelectedColor(color);
  };

  return (
    <div
      className={`text-sm ${styles.settingsWrapper}`}
      style={{ color: "white", textAlign: "center" }}
    >
      {isCategoryWindow ? (
        <div className={styles.categoriesWrapper}>
          <div className={styles.categoryHeading}>
            <button
              className={styles.backToSettings}
              onClick={() => {
                setIsCategoryWindow(false);
              }}
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
                ></path>
              </svg>
            </button>
            <h1>Мои категории</h1>
          </div>{" "}
          {userData?.categories.map((category) => (
            <div
              key={category.name}
              className={styles.category}
              onClick={() => {
                setSelectedCategory(category.name);
              }}
            >
              <div
                className={styles.categoryColor}
                style={{ backgroundColor: "#" + category.color }}
              ></div>
              <p>{category.name}</p>
            </div>
          ))}
          <div className={styles.addButton}>
            <Button
              color="primary"
              onPress={onOpen}
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
              Добавить категорию
            </Button>
          </div>{" "}
          <Drawer
            isOpen={isOpen}
            placement="bottom"
            onOpenChange={onOpenChange}
            className="dark"
            backdrop="blur"
            hideCloseButton
            disableAnimation
          >
            <DrawerContent className={styles.drawer}>
              {(onClose) => (
                <>
                  <DrawerHeader className="py-4 px-6 flex-initial text-large font-semibold flex gap-1 pb-0">
                    <button
                      onClick={() => {
                        setCategoryName("");
                        setSelectedColor("#4DB748");
                        onClose();
                      }}
                      className={styles.closeButton}
                    >
                      <img src="/icons/close.svg" alt="close" />
                    </button>
                    <span style={{ color: "white" }}>Создать категорию</span>
                  </DrawerHeader>

                  <DrawerBody className={styles.drawerBody}>
                    <div className={styles.inputContainer}>
                      <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className={styles.categoryInput}
                        placeholder={
                          [
                            "Транспорт",
                            "Продукты",
                            "Развлечения",
                            "Здоровье",
                            "Одежда",
                            "Рестораны",
                            "Подарки",
                            "Спорт",
                            "Путешествия",
                            "Образование",
                          ][Math.floor(Math.random() * 10)]
                        }
                        maxLength={50}
                      />
                    </div>

                    <div className={styles.colorSection}>
                      <div className={styles.colorGrid}>
                        {colors.map((color) => (
                          <div
                            key={color}
                            className={`${styles.colorOption} ${
                              selectedColor === color
                                ? styles.selectedColor
                                : ""
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              setSelectedColor(color);
                            }}
                          />
                        ))}
                        <div
                          className={`${styles.colorOption} ${
                            !colors.includes(selectedColor)
                              ? styles.selectedColor
                              : ""
                          }`}
                          style={{ backgroundColor: selectedColor }}
                          onClick={() => setShowColorPicker(true)}
                        >
                          <span>+</span>
                        </div>
                      </div>

                      <Modal
                        isOpen={showColorPicker}
                        onClose={() => setShowColorPicker(false)}
                        className="dark"
                        backdrop="blur"
                        placement="center"
                        hideCloseButton
                        motionProps={{
                          variants: {
                            enter: {
                              y: 0,
                              opacity: 1,
                              transition: {
                                duration: 0.1,
                              },
                            },
                            exit: {
                              y: 20,
                              opacity: 0,
                              transition: {
                                duration: 0.1,
                              },
                            },
                          },
                        }}
                      >
                        <ModalContent className={styles.modalColor}>
                          {(onClose) => (
                            <>
                              <ModalHeader>
                                <button
                                  onClick={onClose}
                                  className={styles.closeButton}
                                >
                                  <img src="/icons/close.svg" alt="close" />
                                </button>
                                Выберите цвет
                              </ModalHeader>
                              <ModalBody className={styles.colorPickerModal}>
                                <HexColorPicker
                                  color={selectedColor}
                                  onChange={handleCustomColor}
                                />
                              </ModalBody>
                            </>
                          )}
                        </ModalContent>
                      </Modal>
                    </div>
                  </DrawerBody>

                  <DrawerFooter className={styles.drawerFooter}>
                    <Button
                      color="primary"
                      className={styles.addButtonStyled}
                      onPress={() => handleCreateCategory(onClose)}
                      isDisabled={!categoryName.trim()}
                    >
                      Создать категорию
                    </Button>
                  </DrawerFooter>
                </>
              )}
            </DrawerContent>
          </Drawer>
        </div>
      ) : (
        <>
          <div className={styles.settings}>
            <div className={styles.setting}>
              <button onClick={() => setIsCategoryWindow(true)}>
                <p>Категории</p>
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
            <div className={`${styles.setting} ${styles.disabled}`}>
              <button>
                {" "}
                <p>Подписка (скоро)</p>
                <svg
                  width="8"
                  height="14"
                  viewBox="0 0 8 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L7 7L1 13"
                    stroke="#3582ff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>{" "}
            <div className={styles.setting}>
              <a href="https://t.me/finstorychat">
                <button>
                  {" "}
                  <p>Сообщить об ошибке</p>
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
              </a>
            </div>
            <div className={styles.setting}>
              <button
                onClick={() => {
                  getExcel();
                  setIsModalLoadExcelOpen(true);
                }}
              >
                {" "}
                <p>Скачать данные</p>
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
            <div className={styles.setting}>
              <button
                onClick={() => {
                  window.location.href = "https://t.me/finstoryapp";
                }}
              >
                {" "}
                <p>Telegram-канал</p>
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
            <div className={styles.setting}>
              <button
                onClick={() => {
                  init();
                  openLink(
                    "https://www.youtube.com/playlist?list=PLUkV5N7-7lobeKhjueqVnmEW2RFJu2yxn",
                    {}
                  );
                }}
              >
                {" "}
                <p>YouTube</p>
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
          </div>
          <div className={styles.designer}>
            <svg
              width="30"
              height="24"
              viewBox="0 0 30 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.15593 8.28106C8.44588 7.4975 9.55412 7.4975 9.84407 8.28106L11.2872 12.1811C11.3784 12.4274 11.5726 12.6216 11.8189 12.7128L15.7189 14.1559C16.5025 14.4459 16.5025 15.5541 15.7189 15.8441L11.8189 17.2872C11.5726 17.3784 11.3784 17.5726 11.2872 17.8189L9.84407 21.7189C9.55412 22.5025 8.44588 22.5025 8.15593 21.7189L6.7128 17.8189C6.62164 17.5726 6.42741 17.3784 6.18107 17.2872L2.28106 15.8441C1.4975 15.5541 1.4975 14.4459 2.28106 14.1559L6.18107 12.7128C6.42741 12.6216 6.62164 12.4274 6.7128 12.1811L8.15593 8.28106Z"
                fill="#3582FF"
              />
              <path
                d="M22.9842 2.39398C23.1614 1.91514 23.8386 1.91514 24.0158 2.39398L24.8977 4.77732C24.9534 4.92786 25.0721 5.04656 25.2227 5.10227L27.606 5.98418C28.0849 6.16137 28.0849 6.83863 27.606 7.01582L25.2227 7.89773C25.0721 7.95344 24.9534 8.07214 24.8977 8.22268L24.0158 10.606C23.8386 11.0849 23.1614 11.0849 22.9842 10.606L22.1023 8.22268C22.0466 8.07214 21.9279 7.95344 21.7773 7.89773L19.394 7.01582C18.9151 6.83863 18.9151 6.16137 19.394 5.98418L21.7773 5.10227C21.9279 5.04656 22.0466 4.92786 22.1023 4.77732L22.9842 2.39398Z"
                fill="#3582FF"
              />
            </svg>
            <span>Дизайн приложения</span>
            <a href="https://t.me/Twin_7">@Twin_7</a>
          </div>
          <span className={styles.version}>Версия: v0.6.0</span>
          <Modal
            isOpen={isModalLoadExcelOpen}
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
                    <p>Файл со всеми расходами будет выгружен в бота:</p>
                    <a href="https://t.me/finstorybot">@finstorybot</a>
                  </ModalHeader>
                  <ModalFooter className={styles.removeModalFooter}>
                    <Button
                      color="primary"
                      onPress={() => {
                        setIsModalLoadExcelOpen(false);
                      }}
                    >
                      Готово
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      )}
    </div>
  );
}
