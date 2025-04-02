import { getExpenses } from "@/api/expensesApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async () => {
    const response = await getExpenses(2025, 4);
    return response;
  }
);
