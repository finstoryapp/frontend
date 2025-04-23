import { addExpense, getExpenses } from "@/api/expensesApi";
import { AppDispatch } from "@/store/store";
import { IAddExpense, IExpense } from "@/types/expensesTypes";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { getUnixMonthStartEnd } from "@/utils/getUnixMonthStartEnd";

export const fetchExpenses = createAsyncThunk<
  IExpense[], // <- returns IExpense[]
  void, // recieve nothing (_)
  { state: RootState } // we can use state with RootState type
>("expenses/fetchExpenses", async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const expensesNavbarState = state.expensesNavbar;
  const monthUnixStartEnd = getUnixMonthStartEnd(
    expensesNavbarState.year,
    expensesNavbarState.month
  );
  const response = await getExpenses(
    monthUnixStartEnd.start,
    monthUnixStartEnd.end
  );
  return response;
});

export const addNewExpense = createAsyncThunk<
  void, // <- means: this thunk returns nothing
  IAddExpense, // <- this is the input data structure
  { dispatch: AppDispatch } // <- we use dispatch inside the thunk
>("expenses/addNewExpense", async (args, { dispatch }) => {
  await addExpense(args);
  dispatch(fetchExpenses());
});
