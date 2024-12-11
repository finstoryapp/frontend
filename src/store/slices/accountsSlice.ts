import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Account {
  id: string;
  name: string;
  // ... other properties
}

interface AccountsState {
  accounts: Account[];
  loading: boolean;
}

const initialState: AccountsState = {
  accounts: [],
  loading: true,
};

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<Account[]>) => {
      state.accounts = action.payload;
      state.loading = false;
    },
    addAccount: (state, action: PayloadAction<Account>) => {
      state.accounts.push(action.payload);
    },
  },
});

export const { setAccounts, addAccount } = accountsSlice.actions;
export default accountsSlice.reducer;
