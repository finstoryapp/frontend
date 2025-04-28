import { ExpensesState, IExpense } from "@/types/expensesTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addNewExpense,
  fetchExpenses,
  deleteExpenseById,
} from "./expensesThunks";
import { accountsReducers } from "./expensesReducers";

const initialState: ExpensesState = {
  loadingExpenses: true,
  isAddExpenseWindowOpen: false,
  expenses: null,
  isAddingExpense: false,
  isDeleteExpenseWindow: false,
  selectedExpenseId: "",
  isDeletingExpense: false,
};

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: accountsReducers,
  extraReducers: (builder) => {
    builder.addCase(fetchExpenses.pending, (state) => {
      state.loadingExpenses = true;
    });
    builder.addCase(
      fetchExpenses.fulfilled,
      (state, action: PayloadAction<IExpense[]>) => {
        state.loadingExpenses = false;
        state.expenses = action.payload;
      }
    );
    builder.addCase(addNewExpense.pending, (state) => {
      state.isAddingExpense = true;
    });
    builder.addCase(addNewExpense.fulfilled, (state) => {
      state.isAddingExpense = false;
      state.isAddExpenseWindowOpen = false;
    });
    builder.addCase(deleteExpenseById.pending, (state) => {
      state.isDeletingExpense = true;
    });
    builder.addCase(deleteExpenseById.fulfilled, (state) => {
      state.isDeleteExpenseWindow = false;
      state.isDeletingExpense = false;
    });
  },
});
export const {
  setAddExpenseWindow,
  openDeleteExpenseWindow,
  closeDeleteExpenseWindow,
} = expensesSlice.actions;
export default expensesSlice.reducer;
