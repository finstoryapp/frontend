import { ICategory } from "./categoriesTypes";

export interface IUser {
  id: string;
  telegramId: string;
  categories: ICategory[];
  premiumUntil: string | null;
  defaultCurrency: string;
  createdAt: string;
  username: string | null;
}
export interface UserState {
  isPremiumWindow: boolean;
  isCategoriesWindow: boolean;
  isAddCategoryWindow: boolean;
  isEditCategoryWindow: boolean;
  currentCategoryName: string;
  isCustomColorWindow: boolean;
  isDeleteCategoryWindow: boolean;
  isExportWindow: boolean;
  isPremuim: boolean;
}
export interface IAddCategory {
  //! Color without hashtag #, like 9424d8
}
export interface IUpdateCategory {
  color: string;
  name: string;
  newName: string;
}
