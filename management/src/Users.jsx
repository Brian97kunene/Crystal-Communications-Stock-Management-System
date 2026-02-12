import React, { useState } from "react";
import './UsersStyle.css';
import logo from './logo.jpg';
import File from "./ReadAFile.jsx";





const CrystalCommunications = () => {
    //
    const [product, setProduct] = useState({ name: "", description: "", sku: "", price: "", delivery_cost: "", mark_up: "", vat: "", vendor: "" ,category:"",quantity:0});
    const [searchproduct, setSearchProduct] = useState({ name: "", description: "", sku: "", price: "", delivery_cost: "", mark_up: "", vat: "", vendor: "" ,category:"",quantity:0});
    const [isVisible, setVisible] = useState(false);
    const [isVisible0, setVisible0] = useState(false);

    const port = 5552;

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
            for (let i = tbl.rows.length - 1; i > 0; i--) { tbl.deleteRow(i); }
            const port = 5552;
            const response = await fetch("http://localhost:" + port + "/api/sku/" + sku);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            setSearchProduct(data.data);

           

         
           

            console.log("Fetched data:", data.data);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };



    return (
        <div class="main">
            <img class="logo" src={logo} />
            <h1 class="header">Stock Management System</h1>
            

            <button onClick={() => {
                setVisible(!isVisible)
                
            }}>ADD NEW PRODUCT</button>

            <button class="search_btn" onClick={() => {
                setVisible0(!isVisible0)
               

            }}>Search Products</button>

            {searchproduct > 0 && 


                <form onSubmit={handleSubmit}> {
                    searchproduct.map((key) => (
                        <div key={key}>
                            <label>{key}</label>
                            <input type="text" name={key} value={searchproduct[key]} />
                        </div>))}
                    <button type="submit">Save</button>
                </form>
            }



            {isVisible && < div class="d-inline p-2 bg-primary text-white">
                <input type="text" className="form-control" value={product.name} id="prod_name" placeholder="Product Name" onChange={(e) => setProduct({ ...product, name: e.target.value })} /><br/>
                <input type="text" class="form-control" id="prod_desc" value={product.description} placeholder="Product Description" onChange={(e) => setProduct({ ...product, description: e.target.value })} /><br />
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

                    {<button>Edit</button>}

                </div>}

           

           




        </div >

    );
}

export default CrystalCommunications;
