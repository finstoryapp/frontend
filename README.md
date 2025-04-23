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

### Мысли в процессе

- Текущую дату нужно записывать в слайсе с расходами, чтобы можно было получить всегда доступ к текущему месяцу. Функция getUnixMonthStartEnd получает текущий выбранный год + номер месяца. Т.е. в currentMonthName нужно хранить число.. От 1 до 12. Проверку на точность этого числа нужно сделать в функции getUnixMonthStartEnd.

- Сначала получу расходы, санком. Потом отрисую на ExpensesNavbar год и месяц текущий + сделаю отображение кнопок вперед-назад. Затем добавлю редюсеры для того, чтобы переключаться на следующий месяц и предыдущий.

- Ок, пока в санке сделаю текущий год и месяц. Далее буду возможно initialState сразу настраивать под это. Сейчас главное протестировать все и подключить.

- Сделать нужно подсчет общей суммы. Сначала я посчитаю сумму конкретного аккаунта. Для этого юзаю отдельную util. Сделать это проще, т.к. нужно считать в одной валюте. А затем уже getFullMonthExpensesSum с учетом разных сумм и высокой производительностью (минимальное кол-во запросов к моему API с расходами).

- К слову, нужно будет проверить/подумать, как сделать API с расходами только для юзеров. Возможно, стоит отдельный модуль в nest сделать.

- Чтобы проссумировать все расходы за текущий месяц, сначала получу отдельно расходы по каждому аккаунту + их курсы валют. Т.е. мне нужно что-то вроде [{sum: 100, currency: "USD"}, ...] на выходе.

- Далее я должен пройтись по этому циклу и посчитать общую сумму с учетом рейта по отношению к основной валюте.

- Допустим, дефолтная валюта = USD, а аккаунта - в GEL. Тогда мне нужен курс USD к GEL, чтобы грубо говоря умножить кол-во USD на кол-во GEL. Например, 1 USD = 2.7 GEL, 100 = 270 GEL.
