# skycave-cave-service

AWS serverless port of the SkyCave CaveService microservice for the AU MsDO exam project

## API

Endpoints:

| Path                   | HTTP verb(s)   |
| ---------------------- | -------------- |
| /room/{position}       | GET, PUT, POST |
| /room/{position}/exits | GET            |

### Endpoint "/room/{position}"

- GET (get room at {position})
- POST (create new room at {position})
- PUT (update description and creatorId for room at {position})

#### POST payload

```
{
    "creationTimeISO8601": "2020-09-14T18:14:08.220+02:00",
    "description": "You are standing at the end of a road before a small brick building.",
    "creatorId": "0"
}
```

#### PUT payload

```
{
    "description": "You are standing at the end of a road before a small brick building.",
    "creatorId": "0"
}
```

### Endpoint "/room/{position}/exits"

- GET (get array of exits for room at {position})

## Geting started

```
# Install dependencies
npm install

# Deploy the stack
npm run sls -- deploy

# Invoke endpoint
curl -i https://something.execute-api.us-east-1.amazonaws.com/
```

## Running tests

### Integration tests

```
npm run test
```

### Acceptance tests

```
npm run acceptance
```

## Invoke with curl

```
# GET
curl "https://shsme8hvhb.execute-api.us-east-1.amazonaws.com/room/(0,0,0)"

# POST - create
curl -X POST -H "Content-Type: application/json" -d '{"description":"TEST manual with curl","creatorId":"200"}' "https://shsme8hvhb.execute-api.us-east-1.amazonaws.com/room/(0,0,3)" -i

# PUT - update
curl -X PUT -H "Content-Type: application/json" -d '{"description":"TEST updated manually with curl","creatorId":"200"}' "https://shsme8hvhb.execute-api.us-east-1.amazonaws.com/room/(0,0,3)" -i
```
