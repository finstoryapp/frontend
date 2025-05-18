import { createSlice } from "@reduxjs/toolkit";
import { AccountsState } from "@/types/accountsTypes";
import { accountsReducers } from "./accountsReducers";

const initialState: AccountsState = {
  currentAccountIndex: 0,
  currentAccountId: 0,
  isDeleteAccountWindow: false,
  isAddingAccountWindow: false,
  isEditAccountWindow: false,
};

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: accountsReducers,
});
export const {
  setCurrentAccountIndex,
  setCurrentAccountId,
  setIsDeletingAccountWindow,
  setIsAddingAccountWindow,
  setIsEditAccountWindow,
} = accountsSlice.actions;
export default accountsSlice.reducer;
