import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAccounts } from "@/api/accountsApi";

export const fetchAccounts = createAsyncThunk(
  "accounts/fetchAccounts",
  async () => {
    const response = await getAccounts();
    return response;
  }
);
