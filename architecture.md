# Architecture Diagram

```mermaid
flowchart TD
    Client(["👤 Client\n(Browser / curl / Postman)"])

    subgraph Gateway["API Gateway — :8080"]
        GW["Express Proxy"]
    end

    subgraph Services["Microservices"]
        US["URL Service\n:3001\nPOST /api/urls"]
        RS["Redirect Service\n:3002\nGET /:shortCode"]
        AS["Analytics Service\n:3003\nGET /api/analytics/:shortCode"]
    end

    subgraph Databases["SQLite Databases (Docker Volumes)"]
        URLDB[("urls.db\nurls table")]
        ANDB[("analytics.db\nanalytics table")]
    end

    Client -->|"POST /api/urls"| GW
    Client -->|"GET /:shortCode"| GW
    Client -->|"GET /api/analytics/:code"| GW

    GW -->|"/api/urls"| US
    GW -->|"/:shortCode"| RS
    GW -->|"/api/analytics/*"| AS

    US -->|"INSERT / UPDATE"| URLDB
    RS -->|"SELECT"| URLDB
    RS -->|"POST /internal/analytics (fire-and-forget)"| AS
    AS -->|"INSERT / SELECT"| ANDB
```

## Request Flow

| Action | Path |
|---|---|
| Shorten URL | Client → Gateway → URL Service → urls.db |
| Redirect | Client → Gateway → Redirect Service → urls.db → (notify) Analytics Service → analytics.db |
| Get Analytics | Client → Gateway → Analytics Service → analytics.db |
