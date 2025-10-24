## POST /users/register

Description
---------

Register a new user. This endpoint validates the incoming payload (email and password) and creates a user record.

Mount point
-----------

In this project the router is mounted at `/users` (see `Backend/app.js`), so the full path is:

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

- The validation rules are implemented in `Backend/routes/user.routes.js` using `express-validator` (see `body("email").isEmail()` and `body("password").isLength({ min: 6 })`).
- Ensure you start the server from the `Backend` folder or load your `.env` properly (dotenv is required in `Backend/app.js`).

- Note: The `username` field is used by the controller and is required in the Mongoose `user` model (see `Backend/models/user.js`). However, the current route validation in `Backend/routes/user.routes.js` does not validate `username`. If you want request-time validation, add a rule like:

```js
body('username').trim().notEmpty().withMessage('username is required'),
```

placed alongside the existing `body("email")` and `body("password")` validators.

