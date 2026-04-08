import React, { useState, useEffect } from "react";
import EditProd from './MyForm - Copy.jsx'
import Dom from './antiDOM approach.jsx' 
import './UsersStyle.css'

const ProductsTable = ({ val, close, supplier }) => {

    const [products, setProducts] = useState([]);
    const [editproduct, seteditProduct] = useState([]);

    const [ProdOffset, setProdOffset] = useState(0);
    const [delivery_val, setdelivery_val] = useState(0);
    const [markupprice, setmarkupprice] = useState([]);
    const [popUp, setpopUp] = useState(false);

    const port = 5552;
    useEffect(() => {
        // handle submit data
        const handleSubmit = async () => {
            try {
                const response = await fetch("http://localhost:" + port + "/getproduct/bysupplier/" + supplier.id+"/"+ProdOffset);

                const data = await response.json();
                setProducts(data.data);

                console.log("data :", JSON.stringify(data.data));
                console.log("supplier :", supplier.name);
                //setUsers(data);
            } catch (error) {
                console.error("Error posting data:", error);
            }
        }

        handleSubmit()
    }, [supplier, ProdOffset]);




    useEffect(() => {
        // handle submit data
        const refreshmarkups = async () => {
            try {

                const code = supplier.id;
                const response = await fetch("http://localhost:" + port + "/api/getmarkups",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({code }),
                    }

                );

                const data = await response.json();
               // setProducts(data.data);

                console.log("price mark up data :", JSON.stringify(data.data));
                console.log("supplier :", supplier.name);
                //setUsers(data);
            } catch (error) {
                console.error("Error posting data:", error);
            }
        }

        refreshmarkups()
    }, []);


    const tot_products = products.length;


    const BulkEdit = () => {
        //       MARK UP TEXTBOX
        var margin = document.getElementById("bulk_edit_markUp_textt");
        var crys_marg = document.querySelectorAll(".crystal_markupp");


        //       DELIVERY TEXTBOX
        var tee = document.querySelector(".bulk_edit_textt");
        var iput = document.querySelectorAll(".delivery_costt");

        if (margin.value != "") {
            crys_marg.forEach(i => {
                i.innerHTML = margin.value;
            });
        }


        console.log("Delivery Input: ", tee);



        if (tee.value != "") {
            iput.forEach(i => {
                i.innerHTML = tee.value;
            });
        }
        var markups = {
            sku: [],
            priceWithMarkup: []

        };



        try {
            products.forEach((u, index) => {


                //console.log(u.price_after_mark_up +" - "+ u.sku);

                



                    var markup;

                    if (margin.value != "") {

                        markup = Number(margin.value) / 100;
                    }
                    else {
                        markup = Number(u.mark_up) / 100;

                    }
                    var vat = Number(u.vat) / 100;
                    console.log("*********")
                    var delivery_cost = Number(tee.value);
                   

                    var costs = (u.price + delivery_cost)
                    var crystal = costs * (1 + markup) * (1 + vat);
                    console.log("Crystal Comm Price: " + crystal);

                    var pricce = Number(u.price);
                    var tot_cost = pricce + delivery_cost;


                   // u.delivery_cost = delivery_cost;

                    var percentagess = (Number(1 + markup) * Number(1 + vat));


                    var newP = tot_cost * percentagess;


                    console.log("Crystal: " + newP);
                    console.log("tot_cost: " + tot_cost);
                    console.log("margin: " + margin.value);

                    Number(u.price) + Number(delivery_cost) * Number(1 + Number(markup)) * Number(1 + Number(vat))
                    console.log("Delivery: " + delivery_cost);
                    console.log("Price: " + u.price);
                    console.log("VAT: " + Number(vat + 1));
                    console.log("mark_up: " + u.mark_up);

                    var tot = newP.toFixed(2);

                    markups.priceWithMarkup.push(tot);
                    markups.sku.push(u.sku);
                    u.price_after_mark_up = tot;
                    console.log(newP.toFixed(2));
                    return console.log("WE ARE HERE " + index + " SKU:" + u.sku + " - Price+MarkUp :" + crystal + " - Price: " + u.price);
                

            })

            setmarkupprice(markups);
            console.log(markupprice);


        } catch {

            console.log(te.value);
        }

    }

    const BulkEdit_ = () => {
        // 1. Get the values from the input fields via their IDs (since they aren't controlled yet)
        const bulkMarginVal = document.getElementById("bulk_edit_markUp_textt").value;
        const bulkDeliveryVal = document.getElementById("bulk_edit_textt");



        console.log(bulkDeliveryVal.value," Deli");

        // 2. Map over the products to create a NEW array with updated values
        const updatedProducts = products.map((u, index) => {
            // Only process the first 500 as per your logic
            if (index >= 500) { 

                console.log(updatedProducts);
            return u;
        }
            // Calculate Markup
            const marginValue = bulkMarginVal !== "" ? Number(bulkMarginVal) : Number(u.mark_up);
            const markupDecimal = marginValue / 100;

            // Calculate VAT and Delivery
            const vatDecimal = Number(u.vat) / 100;
            const deliveryCost = bulkDeliveryVal !== "" ? Number(bulkDeliveryVal) : Number(u.delivery_cost);

            // Calculation: (Price + Delivery) * Markup * VAT
            const costs = (Number(u.price) + deliveryCost);
            const totalWithMarkup = costs * (1 + markupDecimal) * (1 + vatDecimal);

            // Return a NEW object (don't mutate the original)
            return {
                ...u,
                delivery_cost: deliveryCost,
                mark_up: marginValue,
                price_after_mark_up: totalWithMarkup.toFixed(2)
            };
        });

        // 3. Update the React State
        setProducts(updatedProducts); // This triggers the UI to refresh automatically

        // 4. Update your separate markupprice state if needed
        setmarkupprice({
            sku: updatedProducts.slice(0, 500).map(p => p.sku),
            priceWithMarkup: updatedProducts.slice(0, 500).map(p => p.price_after_mark_up)
        });
    };


    const editProduct = (prod) => {
       // setEditingUser(prod);
        seteditProduct(prod);
        console.log(prod);
        setpopUp(true);
    }

    const Paginate = (action) => {
        if (action === "next") {
            setProdOffset(i => i + 20);
        } else {

            if (ProdOffset > 0) {
                setProdOffset(i => i - 20);
            }
        }
    };
    // Example with native fetch







    return (
        <div>
        <div >
            {/* Button to open popup */}
            

            {/* Popup */}
            {val && (
                    <div >
                        <h1>TOTAL PRODUCTS: {tot_products}</h1>
                        <div >
                            <div>


                                {popUp && <>

                                    <EditProd product={editproduct} val={popUp} close={() => setpopUp(false)} />
                                </>
                                }
                                <Dom initialProducts={products} />
                            </div>
                            <nav aria-label="Page navigation example">
                                <ul class="pagination justify-content-center">
                                    <li class="page-item">
                                        <button class="page-link" onClick={() => Paginate("prev")} >Previous</button>
                                    </li>
                             
                                    <li class="page-item">
                                        <button class="page-link" onClick={() => Paginate("next")}>Next</button>
                                    </li>
                                </ul>
                            </nav>


              
                        
                    </div>
                </div>
            )}
            </div>


           

           

        </div>
    );
};

// Simple inline styles for demo


export default ProductsTable;




//<table className="table table-striped">
//    <thead style={{ backgroundColor: "white", color: "black", fontWeight: "bold", border: "1px  solid #0c086b" }}>
//        <tr>

//            <td></td>
//            <td>Name</td>
//            <td>SKU</td>
//            <td style={{ backgroundColor: "white", color: "black", fontWeight: "bold" }}>Price</td>
//            <td style={{ backgroundColor: "white", color: "black", fontWeight: "bold" }}>Price+Mark_Up</td>
//            <td>Vendor</td>
//            <td>Delivery <input type="text" className="bulk_edit_textt" placeholder="Bulk edit delivery..."  ></input></td>
//            <td>Category</td>
//            <td>Quantity</td>
//            <td><input type="text" id="bulk_edit_markUp_textt" placeholder="Bulk edit mark up..."  ></input>  Rec. Margin</td>
//            <td style={{ backgroundColor: "white", color: "black", fontWeight: "bold" }}>Updated:</td>
//            <td><button style={{ backgroundColor: "yellow", color: "black", fontWeight: "bold" }} onClick={() => BulkEdit()}>SAVE</button></td>

//        </tr>
//    </thead>

//    <tbody>
//        {products.map((row, index) => (
//            <tr key={row.sku}>
//                {products && <>
//                    <td>{index + 1})</td>
//                    <td>{row.name}</td>
//                    <td>{row.sku}</td>
//                    <td style={{ backgroundColor: "black", color: "white", fontWeight: "bold", }}>R{row.price}</td>
//                    <td style={{ backgroundColor: "black", color: "white", fontWeight: "bold" }}>R{row.price_after_mark_up}</td>
//                    <td>{row.vendor}</td>
//                    <td className="delivery_costt" style={{ backgroundColor: "#0c086b", color: "white", fontWeight: "bold" }}>{row.delivery_cost}</td>
//                    <td>{row.category}</td>
//                    {row.quantity === 0 && <>
//                        <td className="table-danger">{row.quantity}</td>
//                    </>
//                    }
//                    {row.quantity >= 1 && row.quantity < 5 && <>
//                        <td className="table-warning">{row.quantity}</td>
//                    </>
//                    }
//                    {row.quantity >= 5 && <>
//                        <td >{row.quantity}</td>
//                    </>
//                    }
//                    <td className="crystal_markupp">{row.mark_up}%</td>
//                    <td style={{ backgroundColor: "black", color: "white", fontWeight: "bold" }}>{row.updated_on}</td>
//                    <td><button onClick={() => editProduct(row)}>Edit</button></td>
//                </>
//                }

//            </tr>
//        ))}
//    </tbody>
//</table>