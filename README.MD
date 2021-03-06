## API для фискальных регистраторов МИНИ-ФП54

#### Для работы необходим установленный NODE.JS и DLL библиотека (OLE-сервер) версия v1.4.26.731 компании UNISYSTEM:
#### <http://unisystem.ua/wp-content/uploads/2021/02/OLE_ecrT400_dll_v1.4.26.731.zip>

###### Установка: клонировать репозиторий и запустить
`<npm install>`

Приложение запускается как локальный вебсервер и ожидает HTTP Get 
запросов на порту 3000 (по умолчанию)

Реализованы следующие маршруты 
(`<comport>` = СОМ порт, на котором находится регистратор, целое число в диапазоне от 1 до 255):

* /api/v1/`<comport>`/cashier-reg
    * Регистрация кассира
    * Тело запроса (JSON): Не требуется

* /api/v1/`<comport>`/empty-receipt
    * Печать "нулевого" чека
    * Тело запроса (JSON): Не требуется

* /api/v1/`<comport>`/receipt
    * Печать чека (нал/безнал, продажа/возврат)
    * Тело запроса (JSON):
    ```javascript
    {
      "isCash": true,
      "isReturn": false,
      "goods": 
      [
        {
          "id": 1,
          "name": "tovar1",
          "price": 25.55,
          "qty": 1,
          "sum": 25.55
        },
        {
          "id": 2,
          "name": "tovar2",
          "price": 25.00,
          "qty": 2,
          "sum": 50.00
        },
        ...
        {
          "id": n,
          "name": "tovar_n",
          "price": 1.00,
          "qty": 1,
          "sum": 1.00
        },
      ]
    }
    
    /***************************************************************************************************************** 
    * isCash   - true, если наличная продажа, иначе false
    * isReturn - true, если возврат товара, иначе false
    * goods    - список товаров
    * id       - код товара (Целое, 1-999999)
    * name     - название товара (До 48 символов. Кодовая таблица WIN-1251)
    * price    - цена единицы товара (Число с запятой (2 знака) 0-999999.99 Разделитель целой и дробной частей – точка)
    * qty      - количество товара (Число с запятой (3 знака) 0-2147483.647 Разделитель целой и дробной частей – точка)
    * sum      - сумма чека (Число с запятой (2 знака) 0-999999.99 Разделитель целой и дробной частей – точка)
    *****************************************************************************************************************/
    ```

* /api/v1/`<comport>`/x-report
    * Печать Х - отчета
    * Тело запроса (JSON): Не требуется

* /api/v1/`<comport>`/z-report
    * Печать Z - отчета
    * Тело запроса (JSON): Не требуется

* /api/v1/`<comport>`/inout
    * Внос/Вынос денег
    * Тело запроса (JSON): 
    ```javascript
    {
      "sum": 55.55,
      "isIn": true
    }
    
    /***************************************************************************************************************** 
    * sum   - сумма вноса / выноса (Число с запятой (2 знака) 0-999999.99 Разделитель целой и дробной частей – точка)
    * isIn  - true, если внос средств, иначе false
    *****************************************************************************************************************/
    ```

При выполнении, приложение возвращает следующий ответ (JSON):
```javascript
{
  success: (true при удачном выполнении команды, иначе false),
  error_code: (0 при удачном выполнении команды, иначе код ошибки регистратора),
  error: ("нет ошибки" при удачном выполнении команды, иначе описание ошибки)
}
```
Так же приложение записывает логи в папку ./logs