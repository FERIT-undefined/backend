# Brza Klopa API

## User module
**Endpoint:** http://localhost:8000/users/

### Login user (POST)
**Endpoint:** http://localhost:8000/user/login<br/>
**Request body:**<br/>
```json
{
  "email": "marin123@email.com",
  "password": "marin123"
}	
```

### Register new user (POST)
**Endpoint:** http://localhost:8000/user/register<br/>
**Request body:**<br/>
```json
{
  "fname": "Marin",
  "lname": "Maric",
  "email": "marin123@email.com",
  "role": "kuhar",
  "password": "marin123"
}	
```

### Logout user (POST)
**Endpoint:** http://localhost:8000/user/logout<br/>
**Request body:**<br/>
```json
{
  "refreshToken": "TOKEN"
}	
```

### Get all users (POST)
**Endpoint:** http://localhost:8000/user/<br/>
**Request body:**<br/>
```json
{
  "accessToken": "TOKEN",
  "refreshToken": "TOKEN"
}	
```

### Remove user (DELETE)
**Endpoint:** http://localhost:8000/user/remove/:id<br/>
**Request body:**<br/>
```json
{
  "accessToken": "TOKEN",
  "refreshToken": "TOKEN"
}	
```

### Edit user (PATCH)
**Endpoint:** http://localhost:8000/user/:id<br/>
**Request body:**<br/>
```json
{
  "fname": "Marino",
  "lname": "Maric",
  "email": "marino1202@email.com",
  "password": "marin2020",
  "accessToken": "TOKEN",
  "refreshToken": "TOKEN"
}	
```

## Menu module
**Endpoint:** http://localhost:8000/menu/

### All meals on the menu (GET)
**Endpoint:** http://localhost:8000/menu/<br/>
**Request body:** **NONE**

### Add a new meal on the menu (POST)
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
  "accessToken": "TOKEN",
  "refreshToken": "TOKEN"
}	
```

### Remove meal from the menu (DELETE)
**Endpoint:** http://localhost:8000/menu/remove/MEAL_ID<br/>
**Request body:**<br/>
```json
{
  "accessToken": "TOKEN",
  "refreshToken": "TOKEN"
}	
```

### Edit meal from the menu (PATCH)
**Endpoint:** http://localhost:8000/menu/MEAL_ID<br/>
**Request body:**
```json
{
  "name": "Čevapi",
  "description": "Najbolje jelo na svijetu!",
  "price": 20.0,
  "type": "grill",
  "pdv": 25,
  "discount": 10,
  "accessToken": "TOKEN",
  "refreshToken": "TOKEN"
}
```

## Order module
**Endpoint:** http://localhost:8000/order/

### All orders (GET)
**Endpoint:** http://localhost:8000/order/<br/>
**Request body:** **NONE**

### List orders by table ID (GET)
**Endpoint:** http://localhost:8000/order/:table*<br/>
**Request body:** **NONE**

### List orders by meal ID (GET)
**Endpoint:** http://localhost:8000/order/:table/:meal*<br/>
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


## Traffic module
**Endpoint:** http://localhost:8000/traffic/

### Get all finished orders in the given DateTime range(ISO 8601) (GET)
**Endpoint:** http://localhost:8000/order/:start/:end<br/>
**Example of using endpoint:** http://localhost:8000/traffic/2020-12-22T11:00:00/2020-12-22T12:00:00 (gets all orders finished between 22.12.2020. 11:00h and 22.12.2020. 12:00h)<br/>
**Request body:** **NONE**
