import { ExpensesState } from "@/types/expensesTypes";
import { createSlice } from "@reduxjs/toolkit";
import { accountsReducers } from "./expensesReducers";

const initialState: ExpensesState = {
  isAddExpenseWindowOpen: false,
  isDeleteExpenseWindow: false,
  selectedExpenseId: "",
};

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: accountsReducers,
});

export const {
  setAddExpenseWindow,
  openDeleteExpenseWindow,
  closeDeleteExpenseWindow,
} = expensesSlice.actions;
export default expensesSlice.reducer;
