const express = require("express");
const db = require("./db");
const { encode } = require("./base62");
const isUrl = require("validator").isURL;

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const BASE_URL = process.env.BASE_URL || `http://localhost:8080`;

// POST /api/urls — shorten a URL
app.post("/api/urls", (req, res) => {
    const { originalUrl } = req.body;

    // Validate input
    if (!originalUrl) {
        return res.status(400).json({ error: "originalUrl is required" });
    }
    if (!isUrl(originalUrl, { require_protocol: true })) {
        return res.status(400).json({ error: "Invalid URL. Must include http:// or https://" });
    }

    // Generate short code from auto-increment ID
    // Insert without code first to get the ID
    const insert = db.prepare(
        "INSERT INTO urls (short_code, original_url) VALUES (?, ?)"
    );

    // Use a temporary placeholder, then update with real code
    const info = insert.run("__tmp__", originalUrl);
    const id = info.lastInsertRowid;
    const shortCode = encode(id);

    // Update with the real short code
    db.prepare("UPDATE urls SET short_code = ? WHERE id = ?").run(shortCode, id);

    return res.status(201).json({
        shortCode,
        shortUrl: `${BASE_URL}/${shortCode}`,
    });
});

app.listen(PORT, () => {
    console.log(`URL Service running on port ${PORT}`);
});
