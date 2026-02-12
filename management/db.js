import express from 'express';
  
import cors from 'cors';
import pkg from "pg";

const { Pool } = pkg;


const app = express();

const port = 5552;

// Middleware
app.use(express.json({ limit: "20mb" }));

app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: "1234"
});


function  timeStamp() {
    var f = new Date();
    var datee = f.getDate();
    var ff = f.getHours();
    var fff = f.getMinutes();

    return `${datee} - ${ff}:${fff}`;


}

// Test database connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to database:', err.stack);
    } else {
        console.log('Connected to PostgreSQL database at:' + timeStamp());
        release();
    }
});

// CREATE - Add new user
app.post('/createuser', async (req, res) => {
    try {
        const { name, sku, description, price, delivery_cost, mark_up, vat,vendor,quantity,category } = req.body;
        const result = await pool.query(
            'INSERT INTO product (name,sku,description,price,delivery_cost,mark_up,vat,vendor,quantity,category)  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *', [name, sku, description, price, delivery_cost, mark_up, vat, vendor, quantity, category]
            
            
        );
        

        console.log("Inside CREATE AT: " + timeStamp());
        
        
        res.status(201).json({ success: true, data: result.rows[0] +" TESTSSSS" });
 
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});



// CREATE - Add new user from live feed
app.post('/createuserr', async (req, res) => {
    try {
        const { title, description, price, vendor, category } = req.body;
        const count = req.body.rating?.count;
        const result = await pool.query(
            'INSERT INTO product(name,description,price,vendor,category,quantity)   VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [title, description, price, vendor, category,count]


        );


        console.log("Inside CREATE AT: " + timeStamp());


        res.status(201).json({ success: true, data: result.rows[0] + " TESTSSSS" });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});



// READ - Get all users
app.get('/userr', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM product');

        console.log("Inside GET 10:20 AT: " + timeStamp());
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// READ - Get single user
app.get('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM product WHERE id = $1', [id]);
        console.log("Inside GET by ID");
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


// READ - Get BY SKU
app.get('/api/sku/:sku', async (req, res) => {
    try {
        const { sku } = req.params;
        const result = await pool.query('SELECT * FROM product WHERE sku = $1', [sku]);
        console.log("Inside GET by SKU");
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


// UPDATE - Update user
app.put('/updateuser/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, sku, retail_price, delivery_cost, mark_up, vat, quantity, category,vendor } = req.body;
        const result = await pool.query(
            'UPDATE product SET name = $1, description = $2, sku = $3, price = $4, delivery_cost = $5 , mark_up = $6, vat = $7,quantity = $8,category = $9 ,vendor =$11 WHERE id = $10 RETURNING *',
            [name, description, sku, retail_price, delivery_cost, mark_up, vat, quantity, category, id, vendor]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        console.log("Inside UPDATE, AT: " + timeStamp());
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE - Delete user
app.delete('/api/deleteuser/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM product WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        console.log("Inside DELETE, AT: " + timeStamp());
        res.json({ success: true, message: 'User deleted', data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});



///                         BULK OPERATIONS
///                         BULK OPERATIONS
///                         BULK OPERATIONS


app.post('/api/bulk-insert', async (req, res) => {
    try {
        const rows = req.body.rows;

        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(400).json({ success: false, error: 'No rows provided' });
        }

        const inserted = [];
        for (const row of rows) {
            const result = await pool.query(
                `INSERT INTO product(name, description, sku, price, delivery_cost, mark_up, vat, quantity, category, vendor,created_on,detailed_description)
                               VALUES($1,    $2,        $3,   $4,     $5,         $6,    '15.00', $8,       $9,       $10,    NOW(),$11) RETURNING *`,
                [row.name, row.description, row.sku, row.price, row.delivery_cost, row.mark_up, row.vat, row.quantity, row.categoriestree, row.vendor,row.shortdesc]
            );
            inserted.push(result.rows[0]);
        }

        console.log("Inserted rows:", inserted.length);
        res.json({ success: true, data: inserted });
    } catch (error) {
        console.error("Bulk insert error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});
;



///                         VENDOR ROUTES BELOW
///                         VENDOR ROUTES BELOW
///                         VENDOR ROUTES BELOW



// READ - Get all vendors
app.get('/vendors', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM vendor');

        console.log("Inside GET all vendors : " + timeStamp());
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
})



// CREATE - Add new VENDOR
app.post('/createvendor', async (req, res) => {
    try {
        const { name, contact, contact_name, email, address } = req.body;
        const result = await pool.query(
            'INSERT INTO vendor (name,contact,contact_name,email,address,created_at)  VALUES ($1,$2,$3,$4,$5,now()) RETURNING *', [name, contact, contact_name, email, address]


        );


        console.log("Inside CREATE vendor AT: " + timeStamp());


        res.status(201).json({ success: true, data: result.rows[0]  });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});




// Example table: "csv_data"
// Columns: id SERIAL PRIMARY KEY, name TEXT, age INT, email TEXT

// Update database with edited rows
app.post("/api/update-csv", async (req, res) => {
    const rows = req.body.rows;

    try {
        // Clear existing data (optional, depends on your use case)
       

        // Insert updated rows
        for (const row of rows) {
            await pool.query(
                "INSERT INTO product(name, description,contact,contact_name,email,address) VALUES ($1,$2,$3,$4,$5,$6)",
                [row.name, row.age, row.email]
            );
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});






// UPDATE - Update vendor
app.put('/updatevendor/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, contact, contact_name, email, address } = req.body;
        const result = await pool.query(
            'UPDATE vendor SET name = $1, contact = $2, contact_name = $3, email = $4, address = $5 WHERE id = $6 RETURNING *',
            [name, contact, contact_name, email, address, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        console.log("Inside vendor UPDATE, AT: " + timeStamp());
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {

        res.status(500).json({ success: false, error: error.message });
    }
});


// fetch columns for comparision
app.get("/api/db-columns", async (req, res) => {
    const columns = ["price", "name", "sku", "description", "delivery_cost", "category", "mark_up","quantity","vendor","vat"]; // Example: fetch from DB schema
    res.json({ success: true, columns });
});





app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});




