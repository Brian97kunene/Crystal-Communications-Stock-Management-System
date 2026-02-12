import React, { useState, useEffect } from "react";

function ManualRowSelection() {

    const [liveproducts, setliveproducts] = useState([]);
    //const [endPoint, setendPoint] = useState();
    const [currentPage, setCurrentPage] = useState(1);



                        // Pagination logic
                        // Pagination logic
                        // Pagination logic
    const itemsPerPage = 75; // number of rows per page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = liveproducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(liveproducts.length / itemsPerPage);



    // Load all vendors for dropdown
    useEffect(() => {
        const fetchUsers = async () => {
            try {

                const response = await fetch("http://www.localhost:5555/api/syntech-feed");
                const data = await response.json();

                setliveproducts(data.products);
                console.log("GET Data:  " + { data });
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);






   //  MANUALLY   Add product to database


    const addToDb = async (x) => {

        console.log(`${x[1].price} .Product Name:${x.name} - R${x.price}`);
        console.log("************");
        console.log(x);
        console.log("************");

        console.log(liveproducts[1].sku);
        console.log("************");


        for (let i = 0; i < x.length; i++) {
            try {
                const port = 5552;
                const response = await fetch(`http://localhost:${port}/api/bulk-insert`, {
                    method: "POST", // or "PATCH" if partial updates
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(liveproducts[i]),
                });
                
                console.log(`Added: ${x}`);
                //console.log(form.data);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const updatedUser = await response.json();
                console.log("Product Added From feed: ", updatedUser.data);


            }
            catch (err) {

                console.log(`${err} - Something Bad Happened`);

            }
        }


    };


   /* const prods = liveproducts.products;*/
    //const headers = Object.keys(prods[0]);

    return (
        <div className="Live_Feed">
            <h1>Syntech Live Feed:</h1>
            <hr/><hr />

            <table class="table table-striped">
                <thead>
                    <tr>
                        <td>Image</td>
                       <td>Name</td>
                       <td>SKU</td>
                       <td>Price</td>
                       <td>Vendor</td>
                       <td>Category</td>
                       <td>Quantity</td>
                       <td>Margin</td>
                       <td>Updated:</td>
                    </tr>
                </thead>
                <tbody>
                   

                    {currentItems.map((row) => (
                        <tr key={row.sku}>
                            {row.cptstock + row.jhbstock + row.dbnstock >= 0 &&  <>
                            <td><img src={row.featured_image} style={{ width: "100px", height: "auto", borderRadius: "8px", border: "2px solid #ccc", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}  /></td>
                            <td>{row.name}</td>
                            <td>{row.sku}</td>
                            <td>R{row.price}</td>
                            <td>{row.attributes.brand}</td>
                                <td>{row.categorytree}</td>
                            <td>{row.cptstock + row.jhbstock + row.dbnstock}</td> 
                                <td>{row.recommended_margin}%</td>
                                <td>{row.last_modified}</td>
                            </>
                            }
                            </tr>
                            
                    ))}
                </tbody>
               
                    
            </table>

                            {
                                 liveproducts.length > 0  &&
                <>
                    <button onClick={() => addToDb(liveproducts)}>SYNC DB</button>
                            </>
                            }

            {/* Pagination Controls */}
            <div style={{ marginTop: "10px", marginLeft: "530px" }}>
                <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>

                <span style={{ margin: "0 10px" }}>
                    Page {currentPage} of {totalPages}
                </span>

                <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>

            </div>
            
        </div>
    );

} 


export default ManualRowSelection;
