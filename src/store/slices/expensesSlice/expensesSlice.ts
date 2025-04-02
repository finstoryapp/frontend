import { ExpensesState, IExpense } from "@/types/expensesTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchExpenses } from "./expensesThunks";

const initialState: ExpensesState = {
  currentMonth: new Date().getMonth() + 1,
  currentYear: new Date().getFullYear(),
  loadingExpenses: true,
  isAddExpenseWindowOpen: false,
  expenses: null,
};

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {},
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
  },
});

export default expensesSlice.reducer;
