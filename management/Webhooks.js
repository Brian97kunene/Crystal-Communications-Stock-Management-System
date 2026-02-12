import express from 'express';

import cors from 'cors';
import pkg from "pg";

const { Pool } = pkg;


const app = express();

const port = 3000;




app.post('/webhook', (req, res) => {
    console.log(req.body); // Handle incoming event
    res.sendStatus(200);
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
