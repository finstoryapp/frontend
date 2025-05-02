import { PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "@/types/userTypes";

export const userReducers = {
  setPremiumWindow: (state: UserState, action: PayloadAction<boolean>) => {
    state.isPremiumWindow = action.payload;
  },
  setCategoriesWindow: (state: UserState, action: PayloadAction<boolean>) => {
    state.isCategoriesWindow = action.payload;
  },
  setEditingCategoryWindow: (
    state: UserState,
    action: PayloadAction<boolean>
  ) => {
    state.isEditingCategoryWindow = action.payload;
  },
  setAddingCategoryWindow: (
    state: UserState,
    action: PayloadAction<boolean>
  ) => {
    state.isEditingCategoryWindow = action.payload;
  },
};
