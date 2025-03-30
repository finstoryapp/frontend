# Finstory - Финансовый трекер

Project structure:

```bash
├───api
│       accountsApi.ts
│       apiClient.ts
│       categoriesApi.ts
│       expensesApi.ts
│       userApi.ts
│
├───app
│   │   fonts.css
│   │   global.css
│   │   layout.tsx
│   │   not-found.tsx
│   │
│   ├───accounts
│   │       accounts.module.css
│   │       page.tsx
│   │
│   ├───home
│   │       home.module.css
│   │       page.tsx
│   │
│   ├───settings
│   │       page.tsx
│   │       settings.module.css
│   │
│   └───statistics
│           page.tsx
│           statistics.module.css
│
├───components
│   ├───Navbar
│   │       Navbar.module.css
│   │       Navbar.tsx
│   │
│   ├───Providers
│   │       Providers.tsx
│   │
│   └───Subscription
│           Subscription.module.css
│           Subscription.tsx
│
├───store
│   │   store.ts
│   │
│   └───slices
│       ├───accountsSlice
│       │       accountsSlice.ts
│       │
│       ├───navbarSlice
│       │       navbarSlice.ts
│       │       selectors.ts
│       │
│       └───userSlice
│               userReducers.ts
│               userSlice.ts
│               userThunks.ts
│
├───types
│       accountsTypes.ts
│       categoriesTypes.ts
│       expensesTypes.ts
│       userTypes.ts
│
└───utils
        getUnixMonthStartEnd.ts
        getWeekDays.ts
```
