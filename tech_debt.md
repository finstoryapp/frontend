1. Нужно в `interface IAccount` на уровне бэка или где-то еще поменять тип `accountId: string;` на `accountId: number;`

2. Нужно в идеале переместить exchange с exchange.frontgr.com на основной finstoryapi.frontgr.com, чтобы а. был доступ только у зареганых юзеров б. чтобы была проще локальная разработка в. в `currenciesApi` не было https:// ссылки

3. accounts.length > 1 &&

4. В навбаре иконки в папку вставить

5. Блокировать нажатие на фон во время удаления аккаунта или расхода

6. /statistics/page.tsx -> setSurrentStatistics (prevValue) -> убрать в отдельный хук логику +-

7. Сделать переключения вида pie chart -> StatisticsPie (50я строка, закомментировал то на что буду менять)
