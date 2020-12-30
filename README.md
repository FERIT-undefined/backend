# Brza Klopa API

## User modul
**Endpoint:** http://localhost:8000/users/

## Menu modul
**Endpoint:** http://localhost:8000/menu/

### All meals on the menu (GET)
**Endpoint:** http://localhost:8000/menu/
**Request body:** **NONE**

### Add new meal on the menu (POST)
**Endpoint:** http://localhost:8000/menu/add<br/>
**Request body:**<br/>
```json
{
  "name": "Čevapi",
  "description": "Najbolje jelo na svijetu!",
  "price": 20.0,
  "type": "grill",
  "pdv": 25,
  "discount": 0,
  "refreshToken": "TOKEN"
}	
```

### Remove meal from menu (DELETE)
**Endpoint:** http://localhost:8000/menu/remove/MEAL_ID<br/>
**Request body:** **NONE**

### Edit meal from menu (PATCH)
**Endpoint:** http://localhost:8000/menu/MEA_ID<br/>
**Request body:**
```json
{
  "name": "Čevapi",
  "description": "Najbolje jelo na svijetu!",
  "price": 20.0,
  "type": "grill",
  "pdv": 25,
  "discount": 10,
  "refreshToken": "TOKEN"
}
```

## Order modul
**Endpoint:** http://localhost:8000/order/

### All orders (GET)
**Endpoint:** http://localhost:8000/order/
**Request body:** **NONE**

### List orders by table ID (GET)
**Endpoint:** http://localhost:8000/order/:table
**Request body:** **NONE**

### List orders by meal ID (GET)
**Endpoint:** http://localhost:8000/order/:table/:meal
**Request body:** **NONE**

### Add new order (POST)
**Endpoint:** http://localhost:8000/order/add<br/>
**Request body:**<br/>
```json
{
  "table": 1,
  "meals": [
    {
      "name": "Čevapi",
      "price": 20,
      "quantity": 3,
      "status": "Ordered"
    }, {
      "name": "Gulaš",
      "price": 30,
      "quantity": 1,
      "status": "Ordered"
    }
  ],
  "total_price": 90,
  "refreshToken": "TOKEN"
}
```

### Edit whole order (PATCH)
**Endpoint:** http://localhost:8000/order/:id<br/>
**Request body:**<br/>
```json
{
  "table": 1,
  "meals": [
    {
      "name": "Čevapi",
      "price": 20,
      "quantity": 3,
      "status": "Ordered"
    }, {
      "name": "Gulaš",
      "price": 30,
      "quantity": 1,
      "status": "Ordered"
    }
  ],
  "total_price": 90,
  "refreshToken": "TOKEN"
}
```

### Edit meal inside order (PATCH)
**Endpoint:** http://localhost:8000/order/:table/:meal<br/>
**Request body:**<br/>
```json
{
  "status": "done",
  "refreshToken": "TOKEN"
}
```


## Traffic modul
**Endpoint:** http://localhost:8000/traffic/

### Get all finished orders in the given DateTime range(ISO 8601) (GET)
**Endpoint:** http://localhost:8000/order/:start/:end<br/>
**Example of using endpoint:** http://localhost:8000/traffic/2020-12-22T11:00:00/2020-12-22T12:00:00 (gets all orders finished between 22.12.2020. 11:00h and 22.12.2020. 12:00h)
**Request body:** **NONE**
