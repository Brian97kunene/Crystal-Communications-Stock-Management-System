import React, { useState, useEffect } from "react";
import MyClass from "./MyMethods";
import { CSSTransition } from 'react-transition-group';
import './UsersStyle.css'
import { Button } from "bootstrap";


// Main component showing list of users

const ManualList = () => {
    const [products, setproducts] = useState([])
    const [product, setproduct] = useState({})
    const [refresh, setrefresh] = useState(true)
    const [selectedSkus, setSelectedSkus] = useState(new Set());



    useEffect(() => {

        const getEm = async () => {


            const response = await fetch(`http://localhost:5552/api/getsyncedproducts`);
            const data = await response.json();
            setproducts(data.data);

            console.log(data.data);
        }
        getEm();


    }, [refresh]);


    const HandleSubmit = async (prods) => {

        try {

            
            console.log();
            
        }
        catch (err) { console.log(err); }

    }



    const sync = async () => {

        var t = await MyClass.syncProducts(selectedSkus);


        console.log(t);
    };
    const unsync = async () => {

        var t = await MyClass.unsyncProducts(selectedSkus);


        console.log(t);
    };



    const toggleSelect = (sku) => {
        const newSelection = new Set(selectedSkus);
        if (newSelection.has(sku)) {
            newSelection.delete(sku);
        } else {
            newSelection.add(sku);
        }
        setSelectedSkus(newSelection);

        console.log(newSelection);
    };

    // To handle the "Select All" header checkbox
    const toggleAll = () => {

        if (selectedSkus.size === products.length) {
            setSelectedSkus(new Set()); // Deselect all
        } else {
            setSelectedSkus(new Set(products.map(p => p.sku))); // Select all
        };
    }



    const Handle = (col) => {



        console.log(col);

    }
    const HandleChange = (col) => (e) => {
        const val = e.target.value;
        setproduct({ ...product, [col]: val });
    };

    const columnsToExclude = ["id", "detailed_description", "updated_on", "livefee_updated_on", "data_source", "supplier_code", "created_on", "vat", "vendor", "category", "delivery_cost", "price_after_mark_up", "is_synced", "is_duplicate"];

    return (
        <div>


            <button onClick={() => setrefresh(!refresh)}></button>
            {products.length > 0 && (
                <div style={{width:"95%", margin:"0px 0px 100px 50px"}}>
            <h1>ALL SHOPIFY SYNCED PRODUCTS: </h1>
                    {selectedSkus.size > 0 && <>
                        <button onClick={() => unsync()}>Remove</button>
                    </>}
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
                                    <th>Is_Duplicate?</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            {products.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                     <td><input
                                     type="checkbox"
                          checked={selectedSkus.has(row.sku)}
                          onChange={() => toggleSelect(row.sku)}
                      /></td>
                                    {Object.keys(row).filter((col) => !columnsToExclude.includes(col)).map((col, colIndex) => (
                                            <>
                                            <td key={colIndex}>
                                                {row[col]}
                                            </td>
                                            </>
                                    ))}
                                    { row.is_duplicate.toString() === "true" ?

                                        <td ><p className="alert-danger alert" style={{ textAlign: "center" }} >YES</p></td> : <td ><p className="alert-success alert" style={{ textAlign: "center" }} >NO</p></td>
                                    }
                                    </tr>
                                ))}
                            
                        </tbody>
                    </table>

                    <button onClick={() => HandleSubmit(product)}>PUSH TO SHOPIFY</button>
                </div>
            )}
        </div>
    );
}

export default ManualList;

                                    {/*<button onClick={() => Handle(row.s)}>OPTIONS</button>*/}