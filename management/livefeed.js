import express from "express";

import cors from "cors";

const app = express();
const PORT = 5555;

// Allow your React dev server to call this proxy
app.use(cors({ origin: "http://localhost:5555" }));
app.use(cors({ origin: "*" }));
app.get("/api/syntech-feed", async (req, res) => {
    try {
        const response = await fetch(
            "http://www.syntech.co.za/feeds/feedhandler.php?key=F78FFAAD-43F1-43D6-9D13-33009272B821&feed=syntech-json-full"
        );
        const data = await response.json();

        
        console.log("Obj: " +data);
        console.log("****************");
        console.log(data);
        return res.json(data.syntechstock); // send JSON to frontend
    } catch (err) {
        console.error("Proxy error:", err);
        res.status(500).json({ error: "Failed to fetch feed" });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running at http://localhost:${PORT}`);
});
