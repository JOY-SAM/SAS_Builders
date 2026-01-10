# Changes: Driver Model Refactored to User Model

## Summary
The `Driver` model has been removed and consolidated into the `User` model. Drivers are now `User` records with `isDriver = true`.

## API Changes

### Endpoints
The `/drivers` endpoints still exist but now interact with the `users` table.

- **GET /drivers**: Returns a list of Users where `isDriver` is true.
- **POST /drivers**: Creates a new User with `isDriver = true`.
  - **Note**: Since `User` requires an email and password, the backend automatically generates:
    - `email`: `[phoneNumber]@driver.sas.com`
    - `password`: `default_driver_password`
- **GET /drivers/:id**, **PATCH /drivers/:id**, **DELETE /drivers/:id**: Operate on the `User` table.

### Data Model Changes
The response objects from these endpoints are now `User` objects, which contain superset fields compared to the old `Driver` model.

**New Field Types:**
- `isDriver`: `boolean` (previously `BigInt` or non-existent on Driver model).
- `isAdmin`: `BigInt` (on User model).

**Frontend Implications:**
- When displaying drivers, use the same properties (`id`, `name`, `phoneNumber`).
- If you were using `isDriver` on the User object elsewhere, note that it is now a **Boolean** (true/false), not a BigInt.
- No changes required for creating drivers if you only send `name` and `phoneNumber`.

## Action Items for Frontend AI
1.  If you parse `User` objects, ensure `isDriver` is treated as a boolean.
2.  If you show "Drivers", you can continue using `/drivers` API or switch to `/users` and filter by `isDriver`.
