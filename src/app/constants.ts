import { ISetting } from "@/types/constTypes";
import { store } from "@/store/store";
import {
  setCategoriesWindow,
  setIsExportWindow,
  setPremiumWindow,
} from "@/store/slices/userSlice/userSlice";

// Basic constants
export const developmentBack =
  "https://crowd-futures-ellen-beliefs.trycloudflare.com";
export const productionBack = "https://finstoryapi.frontgr.com";
export const EXPENSE_MAX_AMOUNT = 100000000;
export const russianMonths = [
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
export const russianDayNames = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
export const USER_QUERY_KEY = ["user"];
export const ACCOUNTS_QUERY_KEY = ["accounts"];
export const EXPENSES_QUERY_KEY = ["expenses"];
export const RATES_QUERY_KEY = ["rates"];
export const PAYMENT_QUERY_KEY = ["payment"];
export const currencies = [
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
export const DEFAULT_COLORS = [
  "F24822",
  "FFC943",
  "66D575",
  "3DADFF",
  "874FFF",
  "F849C1",
];

// Settings
export const SETTINGS: ISetting[] = [
  {
    name: "Категории",
    function: () => store.dispatch(setCategoriesWindow(true)),
  },
  {
    name: "Подписка",
    function: () => store.dispatch(setPremiumWindow(true)),
  },
  { name: "Telegram-канал", link: "https://t.me/finstoryapp" },
  { name: "Сообщить об ошибке", link: "https://t.me/finstorychat" },
  {
    name: "Скачать данные",
    function: () => {
      store.dispatch(setIsExportWindow(true));
      console.log("text");
    },
  },
  {
    name: "YouTube",
    link: "https://www.youtube.com/playlist?list=PLUkV5N7-7lobeKhjueqVnmEW2RFJu2yxn",
    isExternal: true,
  },
];

// Advantages
export const ADVANTAGES = [
  {
    photo: "advantages/fast.png",
    title: "Быстро",
    text: "Добавляйте расход менее чем за 10 секунд",
  },
  {
    photo: "advantages/categories.png",
    title: "Категории",
    text: "Легкое управление категориями",
  },
  {
    photo: "advantages/statistics.png",
    title: "Наглядно",
    text: "Смотрите статистику по всем счетам или только по одному",
  },
  {
    photo: "advantages/accounts_control.png",
    title: "Под контролем",
    text: "Управляйте разными счетами и валютами",
  },
  {
    photo: "advantages/accounts.png",
    title: "Аккаунты",
    text: "Используйте разные счета для расходов",
  },
  {
    photo: "advantages/add_category.png",
    title: "Больше категорий",
    text: "Добавляйте любые категории",
  },
  {
    photo: "advantages/color.png",
    title: "Цвет",
    text: "Добавляйте цветовые метки для категория",
  },
  {
    photo: "advantages/download.png",
    title: "Делайте выгрузку",
    text: "Данные о расходах можно выгружать в бота",
  },
  {
    photo: "advantages/useful.png",
    title: "Удобно",
    text: "Смотрите данные о расходах за любой период",
  },
];
