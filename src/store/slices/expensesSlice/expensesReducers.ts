import { ExpensesState } from "@/types/expensesTypes";
import { PayloadAction } from "@reduxjs/toolkit";

export const accountsReducers = {
  setAddExpenseWindow: (
    state: ExpensesState,
    action: PayloadAction<boolean>
  ) => {
    state.isAddExpenseWindowOpen = action.payload;
  },
};
