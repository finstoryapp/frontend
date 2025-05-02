import { UserState } from "@/types/userTypes";
import { createSlice } from "@reduxjs/toolkit";
import { userReducers } from "./userReducers";

const initialState: UserState = {
  isPremiumWindow: false,
  isAddingCaterogyWindow: false,
  isEditingCategoryWindow: false,
  isCategoriesWindow: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: userReducers,
});

export default userSlice.reducer;
