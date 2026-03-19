import React, { useState} from "react";
                        import ReadAFile from './ReadAFile.jsx'
import './UsersStyle.css'
const PopupExample = ({val,close }) => {

    const [product, setProduct] = useState({ name: "", description: "", sku: "", price: "", delivery_cost: "", mark_up: "", vat: "", vendor: "", category: "", quantity: 0 });
    
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
   

    return (
        <div>
        <div class="creatProd">
            {/* Button to open popup */}
            

            {/* Popup */}
            {val && (
                <div style={styles.overlay}>
                    <div style={styles.popup}>

                        <div class="drag_drop" style={{ backgroundColor: "blue", color: "white", fontWeight: "bold" }}>
                            <br />
                            <h2>Add Product</h2>
                        </div><br /><br />
                      
                        
                        <input type="text" className="form-control" value={product.name} id="prod_name" placeholder="Product Name" onChange={(e) => setProduct({ ...product, name: e.target.value })} /><br />
                        <input type="text" class="form-control" id="prod_desc" value={product.description} placeholder="Product Description" onChange={(e) => setProduct({ ...product, description: e.target.value })} /><br />
                        <input type="text" id="prod_sku" className="form-control" value={product.sku} placeholder="Product SKU" onChange={(e) => setProduct({ ...product, sku: e.target.value })} /><br />
                        <input type="text" id="prod_price" className="form-control" value={product.price} placeholder="Product price" onChange={(e) => setProduct({ ...product, price: e.target.value })} /><br />
                        <input type="text" id="prod_delivery_cost" className="form-control" value={product.delivery_cost} placeholder="Product delivery_cost" onChange={(e) => setProduct({ ...product, delivery_cost: e.target.value })} /><br />
                        <input type="text" id="prod_mark_up" className="form-control" value={product.mark_up} placeholder="Product mark up" onChange={(e) => setProduct({ ...product, mark_up: e.target.value })} /><br />
                        <input type="text" id="prod_vat" className="form-control" value={product.vat} placeholder="Product VAT" onChange={(e) => setProduct({ ...product, vat: e.target.value })} /><br />


                        <button onClick={handleSubmit} className="btn btn-primary">ADD NEW PRODUCT</button>
                        <br />

                            
                           
                        <br /><br />
                        <div class="drag_drop" style={{ backgroundColor: "", color: "Blue", fontWeight: "bold" }}><br/>
                        <h4>Altenatively, Bulk add Products via Drag & Drop.</h4>
                        <ReadAFile />
                        </div>
                            <button onClick={close}>Close</button>



                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

// Simple inline styles for demo
const styles = {
    overlay: {
        position: "static",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex", justifyContent: "center", alignItems: "center",
        overflowY:"scroll"
    },
    popup: {
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        minWidth: "300px",
        textAlign: "center",
        
    }
};

export default PopupExample;
