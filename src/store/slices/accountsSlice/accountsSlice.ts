import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AccountsState, IAccount } from "@/types/accountsTypes";
import { fetchAccounts } from "./accountThunks";
import { accountsReducers } from "./accountsReducers";

const initialState: AccountsState = {
  loadingAccounts: true,
  accounts: null,
  currentAccountIndex: 0,
};

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: accountsReducers,
  extraReducers: (builder) => {
    builder.addCase(fetchAccounts.pending, (state) => {
      state.loadingAccounts = true;
      state.accounts = null;
      state.currentAccountIndex = 0;
    });
    builder.addCase(
      fetchAccounts.fulfilled,
      (state, action: PayloadAction<IAccount[]>) => {
        state.loadingAccounts = false;
        state.accounts = action.payload;
        state.currentAccountIndex = 0;
      }
    );
  },
});
export const { setCurrentAccountIndex } = accountsSlice.actions;
export default accountsSlice.reducer;
