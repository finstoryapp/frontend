import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Categories {
  name: string;
  color: string;
}

export interface IUser {
  id: string;
  telegramId: string;
  categories: Categories[];
  premiumUntil: string | null;
  defaultCurrency: string;
  createdAt: string;
  username: string | null;
}

interface UserState {
  userData: IUser | null;
  loading: boolean;
}

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
