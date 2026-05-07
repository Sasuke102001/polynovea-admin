# PolyNovea Admin Backend API Specification

## Overview

Build a Node.js REST API using Vercel Functions that connects to Supabase and serves the admin UI. The API will handle all CRUD operations for event management, venue partnerships, blog posts, and metrics.

## Tech Stack

- **Runtime**: Node.js (Vercel Functions)
- **Database**: Supabase PostgreSQL
- **Deployment**: Vercel Functions (same Vercel project as frontend)
- **Framework**: Express.js (or similar)

## Environment Variables

```
SUPABASE_URL=https://psgxfdzjfcgqvgebpmyl.supabase.co
SUPABASE_API_KEY=sb_publishable_aI-mbysg53VphoIILstmVg_Cmtkyv4e
ADMIN_API_KEY=sb_publishable_aI-mbysg53VphoIILstmVg_Cmtkyv4e
```

## Database Schema

Supabase has these tables created:
- `live_events` - Upcoming concerts/performances
- `past_shows` - Historical shows with attendance data
- `venue_partnerships` - Venue partnership information
- `blog_posts` - Blog articles
- `live_metrics` - Dashboard metrics

## API Endpoints

### Authentication
All endpoints require Bearer token in Authorization header:
```
Authorization: Bearer {ADMIN_API_KEY}
```

If token is invalid, return 401 Unauthorized.

---

### 1. Live Events

#### GET /api/content/live-events
Returns all events ordered by date ASC (upcoming first).
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Event Title",
      "date": "2026-05-15",
      "time": "19:00:00",
      "venue": "Venue Name",
      "city": "City Name",
      "capacity": "5000+",
      "status": "LIVE BOOKING",
      "statusType": "active|progress|planned",
      "desc": "Description...",
      "cta": "Book Tickets",
      "href": "https://..."
    }
  ]
}
```

#### POST /api/content/live-events
Create a new event.
```json
{
  "success": true,
  "data": { "id": "uuid", ... }
}
```

#### PUT /api/content/live-events/:id
Update an event.

#### DELETE /api/content/live-events/:id
Delete an event.

---

### 2. Past Shows

#### GET /api/content/past-shows
Returns all shows ordered by date DESC (recent first).
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Show Title",
      "date": "2025-12-20",
      "venue": "Venue Name",
      "city": "City Name",
      "attendance": "1500",
      "desc": "Description...",
      "cta": "View Photos",
      "href": "https://..."
    }
  ]
}
```

#### POST /api/content/past-shows
Create a new past show.

#### PUT /api/content/past-shows/:id
Update a past show.

#### DELETE /api/content/past-shows/:id
Delete a past show.

---

### 3. Venue Partnerships

#### GET /api/content/venue-partnerships
Returns all venues, sortable by city.
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Venue Name",
      "city": "City Name",
      "capacity": "2000",
      "contact_email": "contact@venue.com",
      "logo_url": "https://...",
      "desc": "Description..."
    }
  ]
}
```

#### POST /api/content/venue-partnerships
Create a new venue.

#### PUT /api/content/venue-partnerships/:id
Update a venue.

#### DELETE /api/content/venue-partnerships/:id
Delete a venue.

---

### 4. Blog Posts

#### GET /api/content/blog-posts
Returns published posts only (status = 'published').
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Post Title",
      "slug": "post-title",
      "content": "Post content...",
      "status": "published|draft",
      "publishedAt": "2026-05-10T10:00:00Z"
    }
  ]
}
```

#### GET /api/content/blog-posts/:slug
Fetch single post by slug.

#### POST /api/content/blog-posts
Create a new post (draft or published).

#### PUT /api/content/blog-posts/:id
Update post, manage status transitions.

#### DELETE /api/content/blog-posts/:id
Delete a post.

---

### 5. Live Metrics

#### GET /api/content/live-metrics
Returns all 4 metrics ordered by id ASC.
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "label": "Total Listeners",
      "value": "125000",
      "period": "monthly",
      "trend": "up|down"
    }
  ]
}
```

#### PUT /api/content/live-metrics
Upsert array of metrics (update if exists, create if new).
```json
{
  "success": true,
  "data": [...]
}
```

---

## Error Handling

All errors should return proper status codes with response format:
```json
{
  "success": false,
  "error": "Error message",
  "data": null
}
```

- `400`: Bad request (validation error)
- `401`: Unauthorized (invalid token)
- `404`: Not found
- `500`: Server error

---

## Deployment Instructions

1. Create `/api/` folder in the polynovea-admin Vercel project
2. Build Vercel Functions (`.js` or `.ts` files in `/api/` directory)
3. Add environment variables to Vercel project settings
4. Deploy (automatically on push to main)

The admin UI will automatically call these endpoints at:
```
https://polynovea-admin.vercel.app/api/content/...
```

---

## Notes

- Validate all incoming data
- Use Supabase client library for database queries
- Implement proper error handling
- Return consistent response format on all endpoints
- Set appropriate CORS headers if needed
