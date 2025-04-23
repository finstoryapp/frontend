import { ExpensesNavbarState } from "@/types/expensesNavbarTypes";
import { createSlice } from "@reduxjs/toolkit";
import { expensesNavbarReducers } from "./expensesNavbarReducers";
import { getYearAndMonth } from "@/utils/getYearAndMonth";

// Month indexes from 0 to 11
const initialState: ExpensesNavbarState = {
  year: getYearAndMonth().year,
  month: getYearAndMonth().month,
  isCurrentMonth: true,
};

const expensesNavbarSlice = createSlice({
  name: "expensesNavbar",
  initialState,
  reducers: expensesNavbarReducers,
});

export const { nextMonth, prevMonth } = expensesNavbarSlice.actions;
export default expensesNavbarSlice.reducer;
