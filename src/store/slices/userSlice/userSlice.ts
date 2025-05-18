import { UserState } from "@/types/userTypes";
import { createSlice } from "@reduxjs/toolkit";
import { userReducers } from "./userReducers";

const initialState: UserState = {
  isPremiumWindow: false,
  isAddCategoryWindow: false,
  isEditCategoryWindow: false,
  isCategoriesWindow: false,
  currentCategoryName: "",
  isCustomColorWindow: false,
  isDeleteCategoryWindow: false,
  isExportWindow: false,
  isPremuim: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: userReducers,
});

export const {
  setCategoriesWindow,
  setPremiumWindow,
  setEditCategoryWindow,
  setAddCategoryWindow,
  setCurrentCategoryName,
  setIsCustomColorWindow,
  setIsDeleteCategoryWindow,
  setIsExportWindow,
  setIsPremuim,
} = userSlice.actions;
export default userSlice.reducer;
