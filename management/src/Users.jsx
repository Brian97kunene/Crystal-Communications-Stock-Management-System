import React, { useState } from "react";
import './UsersStyle.css';
import logo from './logo.jpg';
import File from "./ReadAFile.jsx";





const CrystalCommunications = () => {
<<<<<<< HEAD
    //
    const [product, setProduct] = useState({ name: "", description: "", sku: "", price: "", delivery_cost: "", mark_up: "", vat: "", vendor: "" ,category:"",quantity:0});
    const [isVisible, setVisible] = useState(false);
    const [isVisible0, setVisible0] = useState(false);

    const port = 5552;
=======
    const [users, setUsers] = useState([]);
    const [product, setProduct] = useState({ name: "", description:"",sku:"" });
    const port = 5550;
>>>>>>> 4244f5043afe625636b9eb7f6c41dc54d9ba8d1f

    // handle submit data
    const handleSubmit = async () => {
        try {
            const response = await fetch("http://localhost:" + port + "/createuser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(product)
            }); if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            } const data = await response.json();
            console.log("User added:", data.data);
            //setUsers(data);
        } catch (error) {
            console.error("Error posting data:", error);
        }
    }






    // Example with native fetch
    const fetchData = async () => {
        try {


            const sku = document.getElementById("sku").value;

            const tbl = document.getElementById("prod_table");
<<<<<<< HEAD
            for (let i = tbl.rows.length - 1; i > 0; i--) { tbl.deleteRow(i); }
=======
>>>>>>> 4244f5043afe625636b9eb7f6c41dc54d9ba8d1f
            const port = 5552;
            const response = await fetch("http://localhost:" + port + "/api/sku/" + sku);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

<<<<<<< HEAD
            const row = tbl.insertRow();

            if (row == 0) {
                const header = tbl.createTHead();
                header.insertCell().innerText = "ID";
                header.insertCell().innerText = "PRODUCT NAME";
                header.insertCell().innerText = "SKU";
                header.insertCell().innerText = "DESCRIPTION";
                header.insertCell().innerText = "PRICE";
                header.insertCell().innerText = "DELIVERY COST";
                header.insertCell().innerText = "MARK UP";
                header.insertCell().innerText = "VAT";
                header.insertCell().innerText = "CATEGORY";
                header.insertCell().innerText = "QUANTITY";
                header.insertCell().innerText = "VENDOR";

                header.insertRow(0);
            }
            row.insertCell().innerText = data.data.sku;
            row.insertCell().innerText = data.data.name;
            row.insertCell().innerText = data.data.description;
=======
            while (tbl.rows.length > 1) { tbl.deleteRow(1); }
            const row = tbl.insertRow();
            
            row.insertCell().innerText = data.data.name;
            row.insertCell().innerText = data.data.description;
            row.insertCell().innerText = data.data.sku;
>>>>>>> 4244f5043afe625636b9eb7f6c41dc54d9ba8d1f
            row.insertCell().innerText = data.data.price;
            row.insertCell().innerText = data.data.delivery_cost;
            row.insertCell().innerText = data.data.mark_up;
            row.insertCell().innerText = data.data.vat;
<<<<<<< HEAD
            row.insertCell().innerText = data.data.category;
            row.insertCell().innerText = data.data.quantity;
=======
>>>>>>> 4244f5043afe625636b9eb7f6c41dc54d9ba8d1f
            row.insertCell().innerText = data.data.vendor;




<<<<<<< HEAD

=======
            
>>>>>>> 4244f5043afe625636b9eb7f6c41dc54d9ba8d1f
            console.log("Fetched data:", data.data);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };



    return (
        <div class="main">
<<<<<<< HEAD
            <img class="logo" src={logo} />
            <h1 class="header">Stock Management System</h1>
=======
        <img class="logo" src={logo}/>
            <h1 class="header">Crystal Comm. Stock Management System</h1>
            <h3>PRODUCTS</h3>
            <div class="add_new_prod_sec">
                <input type="text" value={product.name} id="prod_name" placeholder="Product Name" onChange={(e) => setProduct({ ...product, name: e.target.value })}/>
                <input type="text" id="prod_desc" value={product.description} placeholder="Product Description" onChange={(e) => setProduct({ ...product, description: e.target.value })}/>
                <input type="text" id="prod_sku" value={product.sku} placeholder="Product SKU" onChange={(e) => setProduct({ ...product, sku: e.target.value })}/>
                <button onClick={handleSubmit}>ADD NEW PRODUCT</button><br />
            </div>
            <div class="search_area">
                <span>SEARCH:</span> 
                <input type="text" id="sku" />
                <button onClick={fetchData}>Go</button>

            </div>


            {/*<button onClick={fetchData}>All Products</button><br />*/}
            {/*<table class="prod_table">*/}
            {/*<thead>*/}
            {/*        <tr> <th>ID</th> <th> PRODUCT NAME</th> <th>DESCRIPTION </th> <th>SKU</th> </tr></thead>*/}
>>>>>>> 4244f5043afe625636b9eb7f6c41dc54d9ba8d1f
            

            <button onClick={() => {
                setVisible(!isVisible)
                
            }}>ADD NEW PRODUCT</button>

            <button class="search_btn" onClick={() => {
                setVisible0(!isVisible0)
               

            }}>Search Products</button>

            {isVisible && < div class="add_new_prod_sec">
                <input type="text" className="add_new_sec" value={product.name} id="prod_name" placeholder="Product Name" onChange={(e) => setProduct({ ...product, name: e.target.value })} /><br/>
                <input type="text" className="add_new_sec" id="prod_desc" value={product.description} placeholder="Product Description" onChange={(e) => setProduct({ ...product, description: e.target.value })} /><br />
                <input type="text" id="prod_sku" className="add_new_sec" value={product.sku} placeholder="Product SKU" onChange={(e) => setProduct({ ...product, sku: e.target.value })} /><br />
                <input type="text" id="prod_price" className="add_new_sec" value={product.price} placeholder="Product price" onChange={(e) => setProduct({ ...product, price: e.target.value })} /><br />
                <input type="text" id="prod_delivery_cost" className="add_new_sec" value={product.delivery_cost} placeholder="Product delivery_cost" onChange={(e) => setProduct({ ...product, delivery_cost: e.target.value })} /><br />
                <input type="text" id="prod_mark_up" className="add_new_sec" value={product.mark_up} placeholder="Product mark up" onChange={(e) => setProduct({ ...product, mark_up: e.target.value })} /><br />
                <input type="text" id="prod_vat" className="add_new_sec" value={product.vat} placeholder="Product VAT" onChange={(e) => setProduct({ ...product, vat: e.target.value })} /><br />
                <input type="text" id="prod_vat" className="add_new_sec" value={product.vendor} placeholder="Product VAT" onChange={(e) => setProduct({ ...product, vat: e.target.value })} /><br />
                

                <button onClick={handleSubmit} className="add_new_sec">ADD NEW PRODUCT</button><br />
            </div>}





            <br />


            {isVisible0 &&
                < div class="search_area">
                    <span>SEARCH:</span>
                    <input type="text" id="sku" />
                    <button onClick={fetchData}>Go</button>



                </div>}

           

           




        </div >

    );
}

export default CrystalCommunications;
