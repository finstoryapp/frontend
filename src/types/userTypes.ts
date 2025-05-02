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
  isAddingCaterogyWindow: boolean;
  isEditingCategoryWindow: boolean;
}
