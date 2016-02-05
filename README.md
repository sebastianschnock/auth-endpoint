# auth-endpoint
Token-based user authentication and authorization endpoint running on Node with Mongodb backing.

# Features
- password encryption
- [JSON-API](http://jsonapi.org/) compliant
- Authorization with Json Web Tokens

# Requirements
Needs a running Mongodb server.

# Installation
```
git clone https://github.com/sebastianschnock/auth-endpoint.git
cd auth-endpoint
npm install
npm run start
```
The endpoint is now running at http://localhost:3000

# Endpoints
Provides the following API endpoints when running:
```
POST    /users          register a new user
GET     /users          get all users
GET     /users/:id      get a specific user
PUT     /users/:id      update a specific user
POST    /authenticate   authenticate a user
```

# Authentication and authorization flow
Here is an examplary flow for user registration, authentication and authorization that can be done when the server is running:

## Registration
Send to server:
```
POST /users
Content Type: application/vnd.api+json
{
  "data": {
    "type": "users",
    "attributes": {
      "email": "mail@test.org",
      "password": "123"
    }
  }
}
```
Response from server:
```
{"data":{"type":"users","id":"56b47fd3416e525d6ee694f6","attributes":{"email":"mail@test.org"},"relationships":{}}}
```

## Authentication
Send to server:
```
POST /authenticate
Content Type: application/json
{
  "email": "mail@test.org",
  "password": "123"
}
```
Response from server:
```
{"success":true,"message":"Authentication succeeded.","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjoiNTZiNDdmZDM0MTZlNTI1ZDZlZTY5NGY2In0sImlhdCI6MTQ1NDY3MDAxNywiZXhwIjoxNDU0NjcxNDU3fQ.Hv1ruQWhW_z88j3UUPq47IOzhwBN5tnSur9WJ6vrDdg","uid":"56b47fd3416e525d6ee694f6"}
```

## Authorization
Use token to get privileged access (change password).
Send to server:
```
PUT /users/56b47fd3416e525d6ee694f6
Content Type: application/vnd.api+json
{
  "data": {
    "type": "users",
    "attributes": {
      "password": "321"
    }
  }
}
Header:
Authorization: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjoiNTZiNDdmZDM0MTZlNTI1ZDZlZTY5NGY2In0sImlhdCI6MTQ1NDY3MDAxNywiZXhwIjoxNDU0NjcxNDU3fQ.Hv1ruQWhW_z88j3UUPq47IOzhwBN5tnSur9WJ6vrDdg"
```