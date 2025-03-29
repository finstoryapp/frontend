import { IUser, UserState } from "@/types/userTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserState = {
  userData: null,
  loading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.userData = action.payload;
      state.loading = false;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
