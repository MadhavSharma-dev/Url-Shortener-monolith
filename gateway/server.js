const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT || 8080;

// Downstream service URLs (injected via Docker Compose env vars)
const URL_SERVICE      = process.env.URL_SERVICE_URL      || "http://url-service:3001";
const REDIRECT_SERVICE = process.env.REDIRECT_SERVICE_URL || "http://redirect-service:3002";
const ANALYTICS_SERVICE = process.env.ANALYTICS_SERVICE_URL || "http://analytics-service:3003";

// ── Route: POST /api/urls → URL Service
app.use(
    "/api/urls",
    createProxyMiddleware({
        target: URL_SERVICE,
        changeOrigin: true,
        on: {
            error: (err, req, res) => {
                res.status(502).json({ error: "URL Service unavailable" });
            },
        },
    })
);

// ── Route: /api/analytics/* → Analytics Service
app.use(
    "/api/analytics",
    createProxyMiddleware({
        target: ANALYTICS_SERVICE,
        changeOrigin: true,
        on: {
            error: (err, req, res) => {
                res.status(502).json({ error: "Analytics Service unavailable" });
            },
        },
    })
);

// ── Route: /:shortCode → Redirect Service (must be last)
app.use(
    "/",
    createProxyMiddleware({
        target: REDIRECT_SERVICE,
        changeOrigin: true,
        on: {
            error: (err, req, res) => {
                res.status(502).json({ error: "Redirect Service unavailable" });
            },
        },
    })
);

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
    console.log(`  /api/urls       → ${URL_SERVICE}`);
    console.log(`  /api/analytics  → ${ANALYTICS_SERVICE}`);
    console.log(`  /:shortCode     → ${REDIRECT_SERVICE}`);
});
