const express = require("express");
const db = require("./db");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3003;

// Internal endpoint called by Redirect Service on every successful redirect
app.post("/internal/analytics", (req, res) => {
    const { shortCode } = req.body;

    if (!shortCode) {
        return res.status(400).json({ error: "shortCode is required" });
    }

    // Record the access timestamp
    db.prepare("INSERT INTO analytics (short_code) VALUES (?)").run(shortCode);

    return res.status(201).json({ message: "Recorded" });
});

// GET /api/analytics/:shortCode — return stats for a short code
app.get("/api/analytics/:shortCode", (req, res) => {
    const { shortCode } = req.params;

    // Get all access timestamps for this code
    const rows = db
        .prepare("SELECT accessed_at FROM analytics WHERE short_code = ? ORDER BY accessed_at ASC")
        .all(shortCode);

    if (rows.length === 0) {
        return res.status(404).json({ error: `No analytics found for '${shortCode}'` });
    }

    return res.json({
        shortCode,
        requestCount: rows.length,
        accessTimestamps: rows.map((r) => r.accessed_at),
    });
});

app.listen(PORT, () => {
    console.log(`Analytics Service running on port ${PORT}`);
});
