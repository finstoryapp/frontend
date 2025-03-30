import { createAsyncThunk } from "@reduxjs/toolkit";
import { authUser } from "@/api/userApi";

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  const response = await authUser();
  return response;
});
