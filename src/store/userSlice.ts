import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Category {
  categoryId: string;
  name: string;
  color: string;
}

interface UserData {
  userId: string;
  defaultCurrency: string;
  categories: Category[];
}

interface UserState {
  userData: UserData | null;
}

const initialState: UserState = {
  userData: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
