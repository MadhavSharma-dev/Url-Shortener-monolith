const express = require("express");
const fetch = require("node-fetch");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3002;
const ANALYTICS_URL = process.env.ANALYTICS_SERVICE_URL || "http://analytics-service:3003";

// GET /:shortCode — redirect to original URL
app.get("/:shortCode", async (req, res) => {
    const { shortCode } = req.params;

    // Look up the short code in the database
    const row = db.prepare("SELECT original_url FROM urls WHERE short_code = ?").get(shortCode);

    if (!row) {
        return res.status(404).json({ error: `Short code '${shortCode}' not found` });
    }

    // Notify analytics service asynchronously (fire-and-forget)
    fetch(`${ANALYTICS_URL}/internal/analytics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shortCode }),
    }).catch((err) => {
        // Log but don't fail the redirect if analytics is down
        console.error("Analytics notification failed:", err.message);
    });

    // 302 redirect to original URL
    return res.redirect(302, row.original_url);
});

app.listen(PORT, () => {
    console.log(`Redirect Service running on port ${PORT}`);
});
