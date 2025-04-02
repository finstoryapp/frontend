import { IUser, UserState } from "@/types/userTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUser } from "./userThunks";

const initialState: UserState = {
  userData: null,
  loading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true;
      state.userData = null;
    });
    builder.addCase(
      fetchUser.fulfilled,
      (state, action: PayloadAction<IUser>) => {
        state.loading = false;
        state.userData = action.payload;
      }
    );
  },
});

export default userSlice.reducer;
