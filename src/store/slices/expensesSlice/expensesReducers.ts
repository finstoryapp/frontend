import { ExpensesState } from "@/types/expensesTypes";

export const accountsReducers = {
  nextMonth: (state: ExpensesState) => {
    state.currentMonth = 0;
  },
  prevMonth: (state: ExpensesState) => {
    state.currentMonth = 0;
  },
};
