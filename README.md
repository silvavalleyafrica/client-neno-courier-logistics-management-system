# Neno Courier Operations

A Next.js operations workspace for shipment management, pickup-station activity, waybill tracking, notifications, and analytics.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Included workflows

- Create shipments with generated waybill numbers and a shipment timeline.
- Search and filter shipments, inspect details, and update shipment status.
- Record station arrivals and collections; arrival updates are added to the workspace notification feed.
- Track a shipment by waybill and review its status history.
- Review operational metrics, routes, station capacity, and shipment reports.
- Manage workspace preferences and review team roles.

This starter runs without a server or external service. Demo records and changes are stored in the browser's local storage; notifications are in-app only. For a multi-user production deployment, connect these workflows to an authenticated API and durable database, and configure a messaging provider for actual transporter and recipient notifications.
