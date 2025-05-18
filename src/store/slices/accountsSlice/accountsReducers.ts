import { PayloadAction } from "@reduxjs/toolkit";
import { AccountsState } from "@/types/accountsTypes";

export const accountsReducers = {
  setCurrentAccountIndex: (
    state: AccountsState,
    action: PayloadAction<number>
  ) => {
    state.currentAccountIndex = action.payload;
  },
  setCurrentAccountId: (
    state: AccountsState,
    action: PayloadAction<number>
  ) => {
    state.currentAccountId = action.payload;
  },
  setIsDeletingAccountWindow: (
    state: AccountsState,
    action: PayloadAction<boolean>
  ) => {
    state.isDeleteAccountWindow = action.payload;
  },
  setIsAddingAccountWindow: (
    state: AccountsState,
    action: PayloadAction<boolean>
  ) => {
    state.isAddingAccountWindow = action.payload;
  },
  setIsEditAccountWindow: (
    state: AccountsState,
    action: PayloadAction<boolean>
  ) => {
    state.isEditAccountWindow = action.payload;
  },
};
