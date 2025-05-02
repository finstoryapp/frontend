import { createSlice } from "@reduxjs/toolkit";
import { AccountsState } from "@/types/accountsTypes";
import { accountsReducers } from "./accountsReducers";

const initialState: AccountsState = {
  currentAccountIndex: 0,
};

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: accountsReducers,
});
export const { setCurrentAccountIndex } = accountsSlice.actions;
export default accountsSlice.reducer;
