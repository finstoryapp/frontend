import { PayloadAction } from "@reduxjs/toolkit";
import { AccountsState } from "@/types/accountsTypes";

export const accountsReducers = {
  setCurrentAccountIndex: (
    state: AccountsState,
    action: PayloadAction<number>
  ) => {
    state.currentAccountIndex = action.payload;
  },
};
