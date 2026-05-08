# Security Specification - Multi-User Order Management

## Data Invariants
1. **User Identity Isolation**: Users can only see their own private profile data (PII) if they exist.
2. **Shop Integrity**: Shop codes are unique and shops belong to specific areas.
3. **Order Ownership**: Workers own the orders they create. Managers can oversee all orders in their scope. Shop owners can only see orders for their own shop code.
4. **Transaction Integrity**: Transactions are immutable once created (audit trail requirement).
5. **Role-Based Access Control**: Identity roles (Owner, Admin, Manager, Worker, Shop Owner) govern CRUD operations.

## The "Dirty Dozen" Payloads (Deny Test Cases)

1. **Identity Spoofing**: Attempt to create an order with `workerUid` matching someone else's UID.
2. **Role Escalation**: Anonymous user attempting to create a user profile with `role: "admin"`.
3. **Ghost Field Update**: Authenticated worker attempting to update an order with an extra field `isPaid: true` that is not in the whitelist.
4. **Immutable Field Tamper**: Manager attempting to change the `createdAt` timestamp of an existing order.
5. **Orphaned Order**: Attempting to create an order for a `shopCode` that does not exist in the `/shops/` collection.
6. **Cross-Tenant Leak**: Shop Owner A attempting to `list` orders for Shop Code B.
7. **Resource Poisoning**: Creating a product with a `baseRate` that is a massive string instead of a number.
8. **PII Exposure**: Regular authenticated user attempting to `get` the profile of another user they do not own.
9. **Status Shortcut**: Worker attempting to move an order status directly from `pending` to `delivered` bypassing `in_transport`. (If applicable, though we usually allow standard state changes).
10. **Terminal State Violation**: Attempting to update an order that is already marked as `delivered` or `cancelled`.
11. **Excessive Resource Usage**: Creating a shop with a `name` string exceeding 2000 characters.
12. **Unverified Access**: User with `email_verified: false` attempting to create any writable resource.

## Next Steps
- Implement `firestore.rules` with these constraints.
- Verify using `isValid[Entity]` helpers and `affectedKeys().hasOnly()` actions.
