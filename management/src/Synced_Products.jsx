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
    const [tiip, settiip] = useState([]);



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
            MyClass.getOtherSupplier(p),
            MyClass.getAllDbProducts(),

        ])
        const a = new Map([]); 
        const aa = []; 
     


        



        console.log(supp);
        console.log(pro);
        console.log("fast fast");

        console.log(p);


        console.log(typeof supp);

        for (const u of p) {

        supp.forEach((i ,indx)=> {

            


            if (i.sku === u.sku && i.supplier !== u.vendor) {
                console.log("match");
                console.log(i);
                console.log(u);


      

                aa.push({

                    sku: u.sku,
                    details:{
                    supplier: i.supplier,
                        price: i.price,
                    Qty:i.quantity
                }
                
            })
                

        }

            }
        )
        }
        //const uniqueArr = aa.filter(
        //    (obj, index, self) =>
        //        index === self.findIndex(o => o.id === obj.id)
        //);


        const unique = [...new Map(aa.map(obj => [obj.sku + obj.details.supplier, obj])).values()];

        console.log(unique);
        settip(unique)

        console.log(aa);
       /* console.log(uniqueArr);*/

        
        console.log(tip)
    }



    const setTitle = (row) => {
       var res = []

        for (const u of tip) {

            if (u.sku === row.sku) {


                console.log("success");


                res.push({sku:u.sku,dups: { supplier: u.details.supplier, price: u.details.price, Qty: u.details.Qty } 
});
            }
        }

        console.log(res);
        var t = "";



      

        // Output: [ { id: 1, name: "Alice" }, { id: 2, name: "Bob" } ]




        res.forEach(i =>

            t += i.dups.supplier + " -  R" + i.dups.price + " -  Qty: " + i.dups.Qty+"\n"
        
        )


        return t;
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
                <div style={{ width: "95%", margin: "0px 0px 0px 0px", display: "flex", justifyContent: "left" }}>
                    <h1 className="alert-warning alert" >No Products Queued</h1>
                </div>

                
            }
            {products.length > 0 && (
                <div style={{width:"99%", margin:"0px 0px 100px 0px"}}>
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
                                        checked={products.length > 0 && selectedSkus.size === products.length}
                                    />
                                </th>

                                {Object.keys(products[0])
                                    .filter((col) => !columnsToExclude.includes(col))
                                    .map((col, indx) => (
                                        <th key={indx}>{col.toUpperCase()}</th>
                                    ))}
                                    <th>Supplier</th>
                                    <th>Has_Duplicate?</th>
                                    <th>Duplicate </th>
                            </tr>
                        </thead>
                          {/*checked={selectedSkus.has(row)}*/}
                        <tbody>
                            
                            {products.map((row, rowIndex) => (
                                
                                 

                                        <tr key={rowIndex}  >
                                     <td><input
                                        type="checkbox"
                                        checked={selectedSkus.has(row)} 
                          onChange={() => toggleSelect(row)}
                      /></td>
                                    {Object.keys(row).filter((col) => !columnsToExclude.includes(col)).map((col, colIndex) => (
                                            <>
                                            <td key={colIndex}>
                                                {row[col]}
                                            </td>
                                            </>
                                    ))}
                                    <td>{ row.vendor}</td>
                                    { row.is_duplicate.toString() === "true" ?

                                        <td title={row.name}  > <p className="alert-danger alert" style={{ textAlign: "center", width: "60px", height: "50px", margin: "0px 0px 0px 10px" }} >YES</p> </td> : <td ><p className="alert-success alert" style={{ textAlign: "center", width: "60px", height: "50px", margin: "0px 0px 0px 10px" }} >NO</p></td>
                                    }
                                    {row.is_duplicate.toString() === "true" ?

                                        < td key={row.id} > <button style={{ width: "100px" }} title={setTitle(row)} onClick={checkDups}>ACTIONS</button></td > : <td><span></span></td>

                                   
                                    }
                                   

                                    {row.is_duplicate.toString() === "true" ? ""  : ""}

                                    <td>
                                        {tip && tip.map((i, indx) => <span  style={{ margin: "0px 0px 0px 0px", color: "red"/*, width: "auto"*/, borderBottom: "1px solid black " }} key={indx}>{(row.sku === i.sku && row.vendor !== i.details.supplier) && <>  {i.details.supplier} - R{i.details.price} - Qty: {i.details.Qty} <br /> </>} </span>)}
                                    </td>
                                    
                    </tr>
                                        

                                ))}
                            
                        </tbody>
                    </table>
                  
                  

                    {selectedSkus.size > 0 && <>
                        <div style={{ width: "95%", margin: "0px 0px 50px 20px", display: "flex", justifyContent: "center" }}>
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
