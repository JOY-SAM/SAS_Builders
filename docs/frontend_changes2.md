# Frontend Update Guide: isAdmin Change

The backend has been updated to change the `isAdmin` field on the `User` model from `BigInt` to `Boolean`.

## Changes Required

### Type Definitions
Any TypeScript interfaces or types on the frontend reflecting the `User` object need to be updated.

**Old:**
```typescript
interface User {
  // ...
  isAdmin: number; // or BigInt or string depending on how it was handled
  // ...
}
```

**New:**
```typescript
interface User {
  // ...
  isAdmin: boolean;
  // ...
}
```

### Logic Updates
- Remove any parsing logic that was handling `BigInt` or `number` for `isAdmin`.
- Treat `isAdmin` as a native boolean (true/false).
