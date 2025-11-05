# API Documentation

## POST /users/register

Description
---------

Register a new user. This endpoint validates the incoming payload (username, email and password) and creates a user record.

Mount Point
---------

POST /users/register

Headers
-------

- Content-Type: `application/json`

Request body
------------

The endpoint expects a JSON body with the following fields:

- `email` (string) — required, must be a valid email address
- `password` (string) — required, minimum length 6 characters
- `username` (string) — required by the user model, should be a non-empty string (trimmed).

Example request
---------------

```json
{
  "username": "alice",
  "email": "user@example.com",
  "password": "secret123"
}
```

Responses (common)
------------------

- 201 Created — User successfully registered. Response body will come from the controller (typically includes created user or auth token depending on implementation).
- 400 Bad Request — Validation failed. Express-validator will return an errors array describing which fields failed (e.g., invalid email, password too short).
- 409 Conflict — (Optional) Email already exists — if the controller checks for duplicates and uses this code.
- 500 Internal Server Error — Unexpected server error.

Notes
-----

- The validation rules are implemented in `Backend/routes/user.routes.js` using `express-validator` (see `body("email").isEmail()` , `body("password").isLength({ min: 6 })` and `body('username').trim().notEmpty().withMessage('username is required')`).
- Ensure you start the server from the `Backend` folder or load your `.env` properly (dotenv is required in `Backend/app.js`).

## POST /users/login

Description
---------

Authenticate an existing user and receive an authentication token.


Request body
------------

The endpoint expects a JSON body with the following fields:

- `email` (string) — required, must be a valid email address
- `password` (string) — required, minimum length 6 characters

Example request
---------------

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

Responses
---------

- 200 OK — Login successful. Response includes:
  ```json
  {
    "token": "JWT_TOKEN_STRING",
    "user": {
      // User object (password excluded)
    }
  }
  ```
- 400 Bad Request — Cases:
  - Validation failed (invalid email format or password too short)
  - Invalid credentials (email not found or password doesn't match)
  - Response includes either validation errors array or `{"message": "invalid credentials"}`
- 500 Internal Server Error — Unexpected server error

Notes
-----

- Password is compared using bcrypt (see `Backend/models/user.js`)
- JWT token is generated using the user's ID and `JWT_SECRET` from environment variables
- The returned user object will not include the password field (Mongoose schema has `select: false` for password)
- The token is also set as an HTTP-only cookie named "token"

# Captain API Routes

## POST /captain/register

Description
---------

Register a new captain (driver) with vehicle details. This endpoint validates the incoming payload including basic user information and vehicle-specific details.

Headers
-------

- Content-Type: `application/json`

Request body
------------

The endpoint expects a JSON body with the following fields:

### Basic Information
- `username` (string) — required, minimum length 3 characters
- `email` (string) — required, must be a valid email address
- `password` (string) — required, minimum length 6 characters

### Vehicle Information
- `vehicleDetails` (object) — required
  - `color` (string) — required, vehicle color
  - `model` (string) — required, vehicle model
  - `licensePlate` (string) — required, must be unique
- `capacity` (number) — required, minimum value 1
- `vehicletype` (string) — required, must be one of: 'car', 'bike', 'auto'

Example request
---------------

```json
{
  "username": "driver1",
  "email": "driver1@example.com",
  "password": "password123",
  "vehicleDetails": {
    "color": "black",
    "model": "Toyota Camry",
    "licensePlate": "ABC123"
  },
  "capacity": 4,
  "vehicletype": "car"
}
```

Responses
---------

- 201 Created — Captain successfully registered. Response includes:
  ```json
  {
    "Captain": {
      "_id": "captain_id",
      "username": "driver1",
      "email": "driver1@example.com",
      "vehicleDetails": {
        "color": "black",
        "model": "Toyota Camry",
        "licensePlate": "ABC123"
      },
      "capacity": 4,
      "vehicletype": "car",
      "isAvailable": false
    },
    "token": "JWT_TOKEN_STRING"
  }
  ```
- 400 Bad Request — Cases:
  - Validation failed (missing fields or invalid format)
  - Email already exists
  - License plate already registered
- 500 Internal Server Error — Unexpected server error

Validation Rules
--------------

- Username: minimum 3 characters
- Email: must be valid email format
- Password: minimum 6 characters
- Vehicle color: non-empty string
- Vehicle model: non-empty string
- License plate: non-empty string, must be unique
- Capacity: integer, minimum 1
- Vehicle type: must be one of: 'car', 'bike', 'auto'

Notes
-----

- The captain's availability status (`isAvailable`) defaults to `false`
- Password is hashed using bcrypt before storage
- License plate numbers must be unique across all captains
- Location tracking fields (`lat`, `lon`) can be updated later

## GET /users/profile or /captains/profile

Description
---------

Get the profile information of the currently authenticated user.

Authentication
-------------

Requires a valid JWT token, provided in one of these ways:
- Bearer token in Authorization header: `Authorization: Bearer YOUR_JWT_TOKEN`
- Cookie: `token=YOUR_JWT_TOKEN`

Request
-------

No request body needed. Just send the request with proper authentication.

Responses
---------

- 200 OK — Successfully retrieved user profile:
  ```json
  {
    "user": {
      "_id": "user_id",
      "username": "alice",
      "email": "user@example.com",
      "createdAt": "2025-10-26T..."
      // password field is excluded
    }
  }
  ```
- 401 Unauthorized — No token provided or invalid token
- 404 Not Found — User not found (e.g., if user was deleted but token still valid)

## GET /users/logout or /captains/logout

Description
---------

Log out the currently authenticated user by invalidating their token.

Authentication
-------------

Requires a valid JWT token, provided in one of these ways:
- Bearer token in Authorization header: `Authorization: Bearer YOUR_JWT_TOKEN`
- Cookie: `token=YOUR_JWT_TOKEN`

Request
-------

No request body needed. Just send the request with proper authentication.

Responses
---------

- 200 OK — Successfully logged out:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```
- 401 Unauthorized — No token provided or invalid token

Notes
-----

The logout process:
1. Clears the "token" cookie if it exists
2. Adds the token to a blacklist (stored in database)
3. Future requests with this token will be rejected



