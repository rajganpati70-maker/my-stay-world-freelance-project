# AnyRenting PWA

## Run

The app is a dependency-free static PWA served by Python:

```bash
python3 server.py
```

The Replit workflow serves it on port 5000.

## Current scope

This first version is a client-side MVP based on the approved AnyRenting reference: responsive property dashboard, property search and filters, demo login/register state, listing details, booking request flow, installable PWA manifest, and offline shell caching. Login, listings, and bookings use local browser storage for the demo; production authentication, database persistence, notifications, and payments are not connected yet.