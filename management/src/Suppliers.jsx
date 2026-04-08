import React, { useState, useEffect } from "react";
import Prods from './productsTable.jsx'
import MyClass from './MyMethods.js'
import CreateSupplier from "./createSupplier.jsx";
import Upload from './ReadAFile.jsx'
import EditSupp from './EditSupplier.jsx'
import Manual_inputs from './Manual_inputs.jsx'
import Livefeed_Updates from './Livefeed_Updates.jsx'
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import 'bootstrap/dist/css/bootstrap.min.css';

const Suppliers = () => {

    const port = 5552;
    const [suppliers,setSuppliers] = useState([])
    const [activeSupplierId, setActiveSupplierId] = useState(null);
    const [showTbl, setshowTbl] = useState(false)
    const [upload, setupload] = useState(false)
    const [manualupload, setmanualupload] = useState(false)
    const [edit, setedit] = useState(false)
    const [updates, setupdates] = useState(true)
    const [editsuppliers, seteditsuppliers] = useState(false)
    const [supps, setsupps] = useState([]);


    // for refreshes
    // for refreshes
    const [progress, setProgress] = useState(0);

    const [loading, setLoading] = useState(false);
    const [refresh, setrefresh] = useState(false);
    // for refreshes
    // for refreshes
    // for refreshes

    useEffect(() => {
        const fetchLastUpdate = async () => {
            try {
               
                setLoading(true);
                setProgress(0);

                // Simulate progress increments while fetching
                const interval = setInterval(() => {
                    setProgress((prev) => (prev <= 75 ? prev + 10 : prev));
                }, 100);
                // for sync testing


                const response = await fetch(`http://localhost:${port}/vendors`);
                const data = await response.json();

                setSuppliers(data.data)
                console.log(data.data)
            } catch (error) {
                console.error("Error fetching last update:", error);
            
        } finally {



            setLoading(false);
            setProgress(0); // reset after short delay

        }
        };
        fetchLastUpdate();
    }, [refresh]);


    useEffect(() => {
        const fetchL = async () => {
            try {
               
                console.log(supps," useEffect!!!")
            } catch (error) {
                console.error( error);
            }
        };
        fetchL();
    }, [supps]);



    // Fetch products
    //useEffect(() => {
    //    const fetchproducts = async () => {
    //        try {


    //            console.log(JSON.stringify(supplier));

    //            const response = await fetch(`http://localhost:${port}/api/users/${supplier.id}`);
    //            const data = await response.json();
                
    //            setupdates(!updates)
    //            console.log(data.data);
    //        } catch (error) {
    //            console.error("Error fetching users:", error);

    //        }
    //    };
    //    fetchproducts();

    //}, [updates]);

   



    /**
 * Converts an integer from 0 to 100 into its English word equivalent
 * with the first letter capitalized.
 */
    function editSupplier(supp) {

        seteditsuppliers(supp);
        setedit(!edit)

    }
    function numberToWords(num) {
        let result = "";

        if (num === 0) {
            result = "zero";
        } else if (num === 100) {
            result = "one hundred";
        } else {
            const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
            const teens = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
            const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

            if (num < 10) {
                result = ones[num];
            } else if (num < 20) {
                result = teens[num - 10];
            } else {
                const tenPlace = Math.floor(num / 10);
                const onePlace = num % 10;
                result = onePlace === 0 ? tens[tenPlace] : `${tens[tenPlace]}-${ones[onePlace]}`;
            }
        }

        // Capitalize the first letter of the resulting string
      

        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    const [isVisible_, setVisible_] = useState(false);

    var l = []
    const mark = (x) => {
        console.log(x);

        if (l.length === 0) {

                    l.push(x);



        } else {

            l.forEach(i => {
                if (l.includes(i)) {

                    console.log()

                }
                else {
                    l.push(x);

                }

            }


            );
        }


        try {

            setsupps((prev) => {


                console.log(prev);
                return [...prev, x];

            }



            );
    }
        
        
        
            
        catch (err) {


            console.log(err);

        }
        finally {

            // Add the new one
            
        console.log(l," list of marked tings");
        console.log(supps," state var");

        }


        



    }
    const deleteProducts = async (product) => {



        console.log(supps);

        const response = await fetch(`http://localhost:${port}/deletevendor`, {
            method: "DELETE", // or "PATCH" if partial updates
            headers: {
                "Content-Type": "application/json"

            },
            body: JSON.stringify({ rows: supps }
               
               
            ),
        });


        if (response.status) {


            setsupps([])
        }
    }


    return (
        <div>


            {loading && (<>

                <p style={{ color: "#0c086b" }}  disabled={loading}>
                    {loading ? "Fetching Suppliers..." : ""}
                </p>
                <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }}>{progress}%</div>
                </div></>
            )}
            




            <div style={{  display: "flex", justifyContent: "center" }}>
                <h1>SUPPLIERS</h1>
                </div>
            <br />
            
            <div style={{  display: "flex", justifyContent: "center" }}>
                <br />
            <button onClick={() => {
                setVisible_(!isVisible_)

            }}>ADD NEW </button>
            </div>

            {isVisible_ && <  >
                <CreateSupplier />
                <br />

            </>} 

                {supps.length >= 1 && <>
                    <button onClick={() => deleteProducts(l)}>DELETE MARKED SUPPLIERS 
                </button><br />
                    </> 
            }
                <button style={{ display:"sticky" , position:"static" }} onClick={() => setrefresh(prev => !prev)}></button>

            <ol>
                    <div class="accordion" id="accordionUpdates">
                        { /*NEW PRODUCTS ACCORDION FEEDBACK*/}
                        { /*NEW PRODUCTS ACCORDION FEEDBACK*/}
                        { /*id="headingOne"*/}

                        <div class="accordion-item">
                        {suppliers.map((supplier, indx) => 
                    <li key={supplier.id}>
                                <input type="checkbox" style={{width:"15px"}} onChange={() => mark(supplier)}></input>

                    
                  

                            <h2 class="accordion-header" id={"heading" + numberToWords(supplier.id)}>
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse" + numberToWords(supplier.id)} aria-expanded="true" aria-controls="collapseOne">

                            <div class="" role="alert">
                                
                                <h1>{supplier.name}</h1>


                               
                                    </div>
                            

                                </button>
                            </h2>
                            <div id={"collapse" + numberToWords(supplier.id)} class="accordion-collapse collapse " aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                <div class="accordion-body">

                           

                                    <div class="" role="alert">
                                    
                                 
                                        <h4>Email: {supplier.email}</h4>
                                        <h4>Contact: {supplier.contact}</h4>
                                        <h4>Business Address: {supplier.address}</h4>
                                        <h4>Data Format: {supplier.data_format}</h4>
                                            <h4>Last Update: {MyClass.formatDate(supplier.created_at)}</h4>
                                {edit && <div>
                                    <br />


                                    <EditSupp supplier={editsuppliers} />
                                </div>
                                }
                                <h4>{supplier.contact_person}</h4>
                                <button onClick={() => setshowTbl(!showTbl)}>View Products</button>

                                            {(supplier.data_format === "XML" || supplier.data_format === "CSV" )&&
                                <button onClick={() => setupload(!upload)}>Update Products</button>

                                }
                                {supplier.data_format === "Manual" &&
                                <button onClick={() => setmanualupload(!manualupload)}>Update Products</button>

                                }
                                {supplier.data_format === "Live Feed" &&
                                    <button onClick={() => setupdates(!updates)}>Check for Updates</button>

                                }


                                <button onClick={() => editSupplier(supplier)}>Update Details</button>

                                <div style={{ display: "flex", justifyContent: "right" }} >

                                                {upload && (supplier.data_format === "XML" || supplier.data_format === "CSV") && (<div>
                                    <br/>


                                        <Upload supplier={supplier} />
                                        </div>)
                                    }
                                    {manualupload && supplier.data_format === "Manual" && (<div>
                                    <br/>


                                                    <Manual_inputs supplier={ supplier} />
                                        </div>)
                                    }
                                    
                                        </div>


                                {updates &&
                                    <div>
                                        <Livefeed_Updates supplier={supplier} update={updates} setupd={() => setupdates(!updates)} />
                                    </div>

                                }


                                {showTbl && <>

                                    
                                {
                                    supplier && <>
                                            <Prods val={showTbl} close={() => { setshowTbl(!showTbl) }} supplier={supplier} /> 
                                         
                                    </>
                                }
                                </>


                                }

                               
                            </div>



                                </div>
                            </div>
                    </li>
            
            )}
                        </div>





                        </div>
                </ol>



     









        </div>
    );
};



export default Suppliers;
