import React, { useState, useEffect } from "react";
import MyClass from "./MyMethods";
import Duplicates from "./vendors";
import { CSSTransition } from 'react-transition-group';
import './UsersStyle.css'
import { Button } from "bootstrap";


// Main component showing list of users

const ManualList = () => {
    const [products, setproducts] = useState([])
    const [product, setproduct] = useState({})
    const [refresh, setrefresh] = useState(true)
    const [duplicatesPopUp, setduplicatesPopUp] = useState(true)
    const [duplicatesProduct, setduplicatesProduct] = useState([])
    const [selectedSkus, setSelectedSkus] = useState(new Set());
    const [tip, settip] = useState("");



    useEffect(() => {

        const getEm = async () => {


            const response = await fetch(`http://localhost:5552/api/getsyncedproducts`);
            const data = await response.json();
            setproducts(data.data);
            
            console.log(data.data);
        }
        getEm();


    }, [refresh]);
    useEffect(() => {

        const getIt = async () => {


            console.log(selectedSkus);
           // var t = await MyClass.unsyncProducts(duplicatesProduct);


            
        }
        getIt();


    }, [selectedSkus]);
    useEffect(() => {

        const getSups = async () => {


            console.log(tip);
           // var t = await MyClass.unsyncProducts(duplicatesProduct);


            
        }
        getSups();


    }, [tip]);


    const suppliers = async (row) => {

        var t = "";




        var Othersupplier = checkDups(row)





    }
    const HandleSubmit = async () => {

        try {

            var t = await MyClass.unsync(duplicatesProduct);
            console.log(t);
            
        }
        catch (err) { console.log(err); }

    }



    const sync = async () => {

        var t = await MyClass.syncProducts(duplicatesProduct);


        console.log(t);
    };
    const unsync = async () => {

        var t = await MyClass.unsyncProducts(selectedSkus);


        console.log(t);
    };



    const toggleSelect = (sku) => {
        const newSelection =[];
        if (newSelection.includes(sku)) {
        console.log();
            
        } else {
            newSelection.push(sku);
        }
        setSelectedSkus((prev) => [...prev, sku]);

        console.log(selectedSkus);
    };

    // To handle the "Select All" header checkbox
    const toggleAll = () => {

        if (selectedSkus.size === products.length) {
            setSelectedSkus(new Set()); // Deselect all
        } else {
            setSelectedSkus(new Set(products.map(p => p))); // Select all
        };
    }


    var  t = [];

    const checkDups = async () => {

        var p = [];

        products.forEach((i) => {
            if (i.is_duplicate) {

                console.log(i)
                p.push(i);

            }
        })
        //console.log("Donezo", products);


        //var response = await MyClass.getOtherSupplier(row);

        //console.log(response);




        //var t = "";
        //console.log(response.data)
        //response.data.forEach(i => {


        //    t += i.supplier +" "+i.quantity+" - R"+i.price+ "\n";

        //}

        //)



        //return response.data;
        const [supp,pro] = await Promise.all([
            MyClass.getOtherSupplier(p[0]),
            MyClass.getAllDbProducts(),

        ])
        const a = new Map([]);






        console.log(pro);
        console.log(supp);
        console.log("fast fast");

        


        console.log(typeof supp);


        supp.forEach(i => {
            console.log(i);
            a.set(i.sku, {
                supplier: i.supplier,
                price:i.price
            })
            t += i.supplier +" "+i.quantity+" - R"+i.price+ "\n";

        }

        )


        settip(t)
        
        console.log(a);
    }
    const Handle = (col) => {
        

        console.log(col);

        if (col.is_duplicate.toString() == "true") {

            console.log("its a dup!!");
            setduplicatesProduct(col)
        }
        else {
            t.push(col)
            console.log(t);
        }
        

    }
    const HandleChange = (col) => (e) => {
        const val = e.target.value;
        setproduct({ ...product, [col]: val });
    };

    const columnsToExclude = ["id", "detailed_description", "updated_on", "livefee_updated_on", "data_source", "supplier_code", "created_on", "vat", "vendor", "category", "delivery_cost", "price_after_mark_up", "is_synced", "is_duplicate"];

    return (
        <div>


            <button onClick={() => setrefresh(!refresh)}></button>
            {products.length === 0 && 
                <div style={{ width: "95%", margin: "0px 0px 50px 20px", display: "flex", justifyContent: "center" }}>
                    <h1 className="alert-warning alert" >No Products Queued</h1>
                </div>

                
            }
            {products.length > 0 && (
                <div style={{width:"95%", margin:"0px 0px 100px 50px"}}>
                <div style={{width:"95%", margin:"0px 0px 50px 20px",display:"flex",justifyContent:"center"}}>
                        <h1>ALL  PRODUCTS QUED FOR SHOPIFY SYNC: </h1>
                    </div>
                    
                    <table className="table table-striped">
                        <thead>
                            <tr>

                                <th>
                                    <input
                                        type="checkbox"
                                        onChange={toggleAll}
                                        checked={product.length > 0 && selectedSkus.size === product.length}
                                    />
                                </th>

                                {Object.keys(products[0])
                                    .filter((col) => !columnsToExclude.includes(col))
                                    .map((col, indx) => (
                                        <th key={indx}>{col.toUpperCase()}</th>
                                    ))}
                                    <th>Supplier</th>
                                    <th>Has_Duplicate?</th>
                            </tr>
                        </thead>
                          {/*checked={selectedSkus.has(row)}*/}
                        <tbody>
                            
                            {products.map((row, rowIndex) => (
                                
                                    <tr key={rowIndex}>
                                     <td><input
                                     type="checkbox"
                          onChange={() => toggleSelect(row)}
                      /></td>
                                    {Object.keys(row).filter((col) => !columnsToExclude.includes(col)).map((col, colIndex) => (
                                            <>
                                            <td key={colIndex}>
                                                {row[col]}
                                            </td>
                                            </>
                                    ))}
                                    <td>{ row.supplier_code}</td>
                                    { row.is_duplicate.toString() === "true" ?

                                        <td title={row.name}  ><p className="alert-danger alert" style={{ textAlign: "center", width: "60px", height: "50px", margin: "0px 0px 0px 10px" }} >YES</p></td> : <td ><p className="alert-success alert" style={{ textAlign: "center", width: "60px", height: "50px", margin: "0px 0px 0px 10px" }} >NO</p></td>
                                    }
                                    {row.is_duplicate.toString() === "true" ?

                                        < td key={row.id} > <button style={{ width: "100px" }} title={tip} onClick={checkDups}>ACTIONS</button></td > : <td><span></span></td>

                                   
                                    }
                                    </tr>
                                ))}
                            
                        </tbody>
                    </table>
                   


                    {selectedSkus.length > 0 && <>
                        <div style={{ width: "95%", margin: "0px 0px 50px 20px", display: "flex", justifyContent: "right" }}>
                            <button onClick={() => unsync()}>Remove Marked</button>
                        </div>
                    </>}

                    <button onClick={() => HandleSubmit(product)}>PUSH TO SHOPIFY</button>
                </div>
            )}
        </div>
    );
}

export default ManualList;
