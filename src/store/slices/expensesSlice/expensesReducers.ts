import { ExpensesState } from "@/types/expensesTypes";
import { PayloadAction } from "@reduxjs/toolkit";

export const accountsReducers = {
  setAddExpenseWindow: (
    state: ExpensesState,
    action: PayloadAction<boolean>
  ) => {
    state.isAddExpenseWindowOpen = action.payload;
  },
  openDeleteExpenseWindow: (
    state: ExpensesState,
    action: PayloadAction<string>
  ) => {
    state.isDeleteExpenseWindow = true;
    state.selectedExpenseId = action.payload;
  },
  closeDeleteExpenseWindow: (state: ExpensesState) => {
    state.isDeleteExpenseWindow = false;
    state.selectedExpenseId = "";
  },
};
