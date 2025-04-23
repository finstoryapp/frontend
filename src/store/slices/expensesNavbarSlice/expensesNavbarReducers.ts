import { ExpensesNavbarState } from "@/types/expensesNavbarTypes";
import { getYearAndMonth } from "@/utils/getYearAndMonth";

export const expensesNavbarReducers = {
  nextMonth: (state: ExpensesNavbarState) => {
    const currentDate = getYearAndMonth();

    if (state.month === 11 && !state.isCurrentMonth) {
      state.year += 1;
      state.month = 0;
    } else {
      state.month += 1;
    }
    if (state.month === currentDate.month && state.year === currentDate.year) {
      state.isCurrentMonth = true;
    } else {
      state.isCurrentMonth = false;
    }
  },

  prevMonth: (state: ExpensesNavbarState) => {
    const currentDate = getYearAndMonth();

    if (state.month === 0) {
      state.year -= 1;
      state.month = 11;
    } else {
      state.month -= 1;
    }

    if (state.month === currentDate.month && state.year === currentDate.year) {
      state.isCurrentMonth = true;
    } else {
      state.isCurrentMonth = false;
    }
  },
};
