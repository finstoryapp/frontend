// Store navbar's state

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Navbar {
  page: "home" | "accounts" | "statistics" | "settings";
}

const initialState: Navbar = {
  page: "home",
};

const navbarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    setNavbarState: (state, action: PayloadAction<Navbar>) => {
      state.page = action.payload.page;
    },
  },
});

export const { setNavbarState } = navbarSlice.actions;
export default navbarSlice.reducer;
