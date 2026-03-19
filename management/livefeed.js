import express from "express";

import cors from "cors";

const app = express();
const PORT = 5555;
const dt = [] ;




function timeStamp() {
    var f = new Date();
    var datee = f.getDate();
    var month = f.getMonth();
    var year = f.getFullYear();
    var ff = f.getHours();
    var fff = f.getMinutes();


    if (ff < 9) {
        if (fff < 9) {
            return `0${ff}:0${fff} - ${datee}/${month}/${year}`;
        }
    }
    else {

        if (fff < 9) {
            return `${ff}:0${fff} -  ${datee}/${month}/${year}`;
        }
        else {

            return `${ff}:${fff} -  ${datee}/${month}/${year}`;
        }
    }

}


// Allow your React dev server to call this proxy

// Allow requests from your frontend
app.use(cors({
    origin: 'http://localhost:5173',  // frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
                  // if you need cookies/auth headers
}));

// Example route
app.get('/api/data', (req, res) => {
    res.json({ message: 'CORS is working!' });
});



app.get("/api/syntech-feed", async (req, res) => {
    try {
        const response = await fetch(
            "http://www.syntech.co.za/feeds/feedhandler.php?key=F78FFAAD-43F1-43D6-9D13-33009272B821&feed=syntech-json-full"
        );
        const data = await response.json();


        dt.push(data);
        return res.json(data.syntechstock); // send JSON to frontend
    } catch (err) {
        console.error("Proxy error:", err);
        res.status(500).json({ error: "Failed to fetch feed" });
    }
});

app.listen(PORT, () => {
    console.log(`Connection estblished at: ${timeStamp()}`);
    console.log(`Proxy server running at http://localhost:${PORT}`);
});
