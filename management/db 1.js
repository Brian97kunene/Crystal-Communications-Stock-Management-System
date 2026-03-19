import express from 'express';
  
import cors from 'cors';
import pkg from "pg";
import os from "os";
import { join } from 'path';

const { Pool } = pkg;


const app = express();

const port = 5552;

// Middleware
app.use(express.json({ limit: "20mb" }));

app.use(cors());
app.use(express.json());

app.use(cors({ origin: 'http://localhost:5173' }));







// PostgreSQL connection
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'Crystal_communications',
    user: 'postgres',
    password: "GodUser"
});

function SyncTransaction(query, query1) {
    // Express.js Backend Route
    app.post('/api/purchase', async (req, res) => {
        const client = await pool.connect(); // Get a client from the pool

        try {
            await client.query('BEGIN'); // 1. Start Transaction

       

            // 2. Deduct balance from user
            const deductRes = await client.query(query);

          

            // 3. Record the order
            await client.query(
              query1
            );

            await client.query('COMMIT'); // 4. Save changes
            res.status(200).send('Transaction successful');

        } catch (error) {
            await client.query('ROLLBACK'); // 5. Undo everything on error
            res.status(500).send(`Transaction failed: ${error.message}`);
        } finally {
            client.release(); // Always release the client back to the pool
        }
    }); 


}
function  timeStamp() {
    var f = new Date();
    var datee = f.getDate();
    var month = f.getMonth();
    var year = f.getFullYear();
    var ff = f.getHours();
    var fff = f.getMinutes();


    var t = os.totalmem() / 1000000000;

    var timee = "";


    if (ff < 9) {
        if (fff < 9) {

            timee = `0${ff}:0${fff} - ${datee}/${month}/${year}`;
            
        }
    }
    else {

        if (fff < 9) {
            timee = `${ff}:0${fff} -  ${datee}/${month}/${year}`;
           
        }   
        else {
            timee = `${ff}:${fff} -  ${datee}/${month}/${year}`;
           
        }
    }

    return timee + ` TOTAL MEMORY: ${t.toFixed(2)}GB`;

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



app.post('/api/purchase', async (req, res) => {
    const client = await pool.connect(); // Get a client from the pool
    const { query, query1 } = req.body; // Expecting SQL queries in request body
    try {
        SyncTransaction(query, query1);
;
    }
    catch (error) {
        res.status(500).send(`Transaction failed: ${error.message}`);

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
            'INSERT INTO product(name,description,price,vendor,category,quantity,created_on,updated_on)   VALUES ($1,$2,$3,$4,$5,$6,now(),now()) RETURNING *', [title, description, price, vendor, category,count]


        );


        console.log("Inside CREATE AT: " + timeStamp());


        res.status(201).json({ success: true, data: result.rows[0] + " TESTSSSS" });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});



// READ - Get all products count
app.get('/getproductcount', async (req, res) => {
    try {
        const result = await pool.query('SELECT count(*) as "total" FROM product');

        console.log("Inside GET 'product' count AT: " + timeStamp());
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


// READ - Get all users with pagination
app.get('/userr/:x', async (req, res) => {
    try {
        var {x} = req.params
        const result = await pool.query(`SELECT * FROM product where  quantity >= 1 order by livefee_updated_on asc LIMIT 10 OFFSET ${x}`);

        console.log("Inside GET 'product' AT: " + timeStamp());
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});



// READ - Get all products
app.get('/allproducts/', async (req, res) => {
    try {
        
        const result = await pool.query(`SELECT * FROM product`);

        console.log("Inside GET 'product' AT: " + timeStamp());
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});



// READ - Get all users
app.get('/getproduct/byname/:x', async (req, res) => {
    try {
        var { x} = req.params;

        const result = await pool.query("SELECT * FROM product where name ilike  $1 ", [x+"%"]);

        console.log("Inside GET 'getproduct' AT: " + timeStamp());
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.log(x+"    ");
        res.status(500).json({ success: false, error: error.message });
    }
});

// READ - Get all users
app.get('/getproduct/bysku/:x', async (req, res) => {
    try {
        var { x} = req.params;

        const result = await pool.query("SELECT * FROM product where sku ilike  $1 ", [x+"%"]);

        console.log("Inside GET 'getproduct' AT: " + timeStamp());
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.log(x+"    ");
        res.status(500).json({ success: false, error: error.message });
    }
});

// READ - Get all products by supplier
app.get('/getproduct/bysupplier/:x/:y', async (req, res) => {
    try {
        var { x,y} = req.params;

        const result = await pool.query("SELECT * FROM product where supplier_code = $1 limit 15 offset $2 ", [x,y]);

        console.log("Inside GET 'getproduct' by supplier_code AT: " + timeStamp());
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.log(x+"    ");
        res.status(500).json({ success: false, error: error.message });
    }
});





// READ - Get last update
app.get('/lastupdate', async (req, res) => {
    try {
        const result = await pool.query('SELECT updated_on FROM product where updated_on is not null order by updated_on desc limit 1');

        console.log("Inside GET last update timestamp AT: " + timeStamp());
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// READ - Get single user
app.get('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM product WHERE id = $1 ', [id]);
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
app.post('/updateproducts/:sku', async (req, res) => {
    try {
       
        const rows = req.body.rows;
        const sku = req.params;



        const result = await pool.query(
            'UPDATE product SET  $2 ,updated_on = now() WHERE sku = $1 RETURNING *',
            [sku, rows]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        console.log("Inside UPDATE, AT: "+ timeStamp());
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        
        res.status(500).json({ success: false, error: error.message });
    }
});



// DELETE - Delete PRODUCT
app.delete('/api/deleteuser/:sku', async (req, res) => {
    try {
        const { sku } = req.params;
        const result = await pool.query('DELETE FROM product WHERE sku = $1', [sku]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        console.log("Inside DELETE, AT: " + timeStamp());
        res.json({ success: true, message: 'User deleted', data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// UPDATE  PRODUCT
app.post('/api/updateproduct/:sku/:quantity', async (req, res) => {
    try {
        const { sku, quantity } = req.params;
        const result = await pool.query('UPDATE FROM product SET quantity = $1 WHERE sku = $2', [quantity,sku]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'PRODUCT not found' });
        }
        console.log("Inside UPDATE PRODUCT By SKU, AT: " + timeStamp());
        res.json({ success: true, message: 'Product Update', data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});



///                         MAPPED BULK OPERATIONS


app.post('/api/bulk-insert', async (req, res) => {
    try {
        const rows = req.body.rows;
        const supplier = req.body.supply;
        let status = null;

        const supp_code = supplier.id;  

            console.log("supplier of bulk:",supp_code);
            console.log("bulk:",rows);
        
            
        for (const row in rows) {

            console.log("0000");
            console.log(rows[row])
           

            const result = await pool.query(
                `INSERT INTO product (
            name, detailed_description, sku, price, delivery_cost, mark_up, quantity, category, vendor, updated_on, created_on, vat, description,supplier_code
         )
         VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9,NOW(),NOW(),15, $10, $11        
         ) 

         on conflict (sku)
            DO UPDATE SET
            price = EXCLUDED.price,
            quantity = EXCLUDED.quantity,
            mark_up = EXCLUDED.mark_up,
            updated_on = Now() RETURNING*;`,
                [
                    rows[row].name,
                    rows[row].description,
                    rows[row].sku,
                    rows[row].price,
                    rows[row].delivery_cost,
                    rows[row].mark_up,
                    0, // 7
                    '',
                    '',         
                    '',
                    supp_code //12


                ]
            );
            status = result.command; // "INSERT" or "UPDATE"
            console.log("Last operation:", result.rows);
        }

        res.status(200).json({ success: true});

        console.log("Last operation:", status);


        



    } catch (error) {
        console.error("Bulk insert error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});


///                         SYNTECH BULK OPERATIONS
///                         SYNTECH BULK OPERATIONS




app.delete('/api/syntech/bulk-delete', async (req, res) => {
    try {
        const rows = req.body.rows;
        let status = null;


       


        for (const row of rows) {
            const result = await pool.query(
                `DELETE FROM product WHERE sku = $1 ;`,
                [

                    row.sku,            //3
                    //11 description
                ]
            );

            status = result.command; // "INSERT" or "UPDATE"
        }

        console.log("Last operation:", status);
        res.json({ success: true, status });
    } catch (error) {
        console.error("Bulk insert error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});





app.post('/api/syntech/bulk-insert', async (req, res) => {
    try {
        const rows = req.body.rows;
        let status = null;


        
            for (const row of rows) {
                var qty = Number(Number(row.dbnstock) + Number(row.cptstock) + Number(row.jhbstock)) || 0;

                const result = await pool.query(
                    `INSERT INTO product (
            name, detailed_description, sku, price, delivery_cost, mark_up, quantity, category, vendor, updated_on, created_on, vat, description, livefee_updated_on,data_source
         )
         VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW(), 15.00, $11, $10,'syntech'
         ) RETURNING*;`,
                    [
                        row.name,         //1
                        row.description, //2  // detailed_description
                        row.sku,            //3
                        row.price,          //4
                        row.delivery_cost,  //5
                        row.recommended_margin, //6 // mark_up
                        qty, //7 quantity
                        row.categorytree,                           //8 category
                        row.attributes?.brand || 'Unknown Vendor',                   //9 vendor
                        row.last_modified,                       //10 livefee_updated_on
                        row.shortdesc                       //11 description
                    ]
                );

                status = result.command; // "INSERT" or "UPDATE"

            console.log("Last operation:", status);
            

        }
        
    

    } catch (error) {
        console.error("Bulk insert error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Step 1: Begin transaction and perform CRUD
app.post('/api/syntech/bulk-update', async (req, res) => {
    
    try {
     
        
        const rows = req.body.rows;
        const myresults = [];

        console.log("typeof myrows: ");
        console.log(typeof rows.feedProd);

        for (const row of rows) {
            var qty = Number(Number(row.dbnstock) + Number(row.cptstock) + Number(row.jhbstock)) || 0;
            

            console.log("INSIDE 'SYNCDB' : "+row.sku);



        const result = await pool.query(
            `UPDATE product  SET quantity = $1, price=$2 where sku = $3 RETURNING *;
           `, [qty, row.price, row.sku]
            
        );
       






            myresults.push(result);

        }
            res.json({ success: true, message: 'Sync completed', data: myresults });
    } catch (error) {
        console.log("SERVER ERR: "+error);
    }
});







///                         SYNTECH BULK OPERATIONS ABOVE 
///                         SYNTECH BULK OPERATIONS ABOVE
///                         SYNTECH BULK OPERATIONS ABOVE





// Step 3: Commit after user confirms
app.post('/commit/:transactionId', async (req, res) => {
    const client = req.app.locals.transactions[req.params.transactionId];
    if (!client) return res.status(400).json({ success: false, error: 'Invalid transaction ID' });

    try {
        await client.query('COMMIT');
        client.release();
        delete req.app.locals.transactions[req.params.transactionId];
        res.json({ success: true, message: 'Transaction committed' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Step 4: Rollback if user cancels
app.post('/rollback/:transactionId', async (req, res) => {
    const client = req.app.locals.transactions[req.params.transactionId];
    if (!client) return res.status(400).json({ success: false, error: 'Invalid transaction ID' });

    try {
        await client.query('ROLLBACK');
        client.release();
        delete req.app.locals.transactions[req.params.transactionId];
        res.json({ success: true, message: 'Transaction rolled back' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


 


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
// READ - Get a vendor
app.get('/vendor/:id', async (req, res) => {

    const id = req.params;

    try {
        const result = await pool.query('SELECT * FROM vendor where id = $1',[id]);

        console.log("Inside GET a vendor : " + timeStamp());
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
})
// READ - Get a vendor by name
app.get('/vendor/byname/:name', async (req, res) => {

    const name = req.params.name;
    var t = "";
    console.log(name);
    for (let i = 0; i <= name.length-1; i++) {


        console.log(name[i])

        if (name[i] != ",") {

            t += name[i];
        }
        else {


            t += " ";
        }

        console.log();
    }


    console.log("name :",t);


    
    console.log("**");
    try {
        const result = await pool.query('SELECT * FROM vendor where name ilike $1', [t]);

        console.log("Inside : " + name);
        console.log("res: " + result);
        console.log("Inside GET a vendor by name : " + timeStamp());
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




