import { PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "@/types/userTypes";

export const userReducers = {
  setPremiumWindow: (state: UserState, action: PayloadAction<boolean>) => {
    state.isPremiumWindow = action.payload;
  },
  setCategoriesWindow: (state: UserState, action: PayloadAction<boolean>) => {
    state.isCategoriesWindow = action.payload;
  },
  setEditCategoryWindow: (state: UserState, action: PayloadAction<boolean>) => {
    state.isEditCategoryWindow = action.payload;
  },
  setAddCategoryWindow: (state: UserState, action: PayloadAction<boolean>) => {
    state.isAddCategoryWindow = action.payload;
  },
  setCurrentCategoryName: (state: UserState, action: PayloadAction<string>) => {
    state.currentCategoryName = action.payload;
  },
  setIsCustomColorWindow: (
    state: UserState,
    action: PayloadAction<boolean>
  ) => {
    state.isCustomColorWindow = action.payload;
  },
  setIsDeleteCategoryWindow: (
    state: UserState,
    action: PayloadAction<boolean>
  ) => {
    state.isDeleteCategoryWindow = action.payload;
  },
  setIsExportWindow: (state: UserState, action: PayloadAction<boolean>) => {
    state.isExportWindow = action.payload;
  },
  setIsPremuim: (state: UserState, action: PayloadAction<boolean>) => {
    state.isPremuim = action.payload;
  },
};
