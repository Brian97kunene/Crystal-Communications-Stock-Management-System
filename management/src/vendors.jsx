import React, { useState, useEffect } from "react";
import './UsersStyle.css'



const PopUp = (product ) => {

    //const [onpageshow, setOnPageShow] = useState(true)
    const port = 5552;
    const [dupProducts, setdupProducts] = useState([]);
    const [editingVendor, seteditingVendor] = useState(null);

    const [refresh, setrefresh] = useState(true)

    // toggle vendor visibility
    const [VendorVisibility, setVendorVisibility] = useState(false)
    // Load all vendors
    useEffect(() => {
        const fetchvendors = async () => {
            try
            {
                console.log(product);

                var sku = product.products.sku;

                console.log(sku);

                const response = await fetch("http://localhost:" + port + "/api/sku/" + sku);
                const data = await response.json();
                setdupProducts(data.data);

                console.log(data);

            } catch (error) {
                console.error("Error fetching vendors:", error);
            }
        };

        fetchvendors();
    }, []);

    // Update vendor in state after editing
    const handlevendorUpdated = (updatedvendor) => {
        setvendors(vendors.map(u => (u.id === updatedvendor.id ? updatedvendor : u)));
    };



    const columnsToExclude = ["id", "detailed_description", "updated_on", "livefee_updated_on", "data_source", "supplier_code", "created_on", "vat", "vendor", "category", "delivery_cost", "price_after_mark_up", "is_synced", "is_duplicate"];



    return (


        <div className="vendor_List">


            <button onClick={() => setrefresh(!refresh) }> ref
        </button>

            {!Array.isArray(dupProducts) || dupProducts.length === 0 ? (
                ""
            ) : (<>
                    
                       
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        {Object.keys(dupProducts[0])
                                            .filter((col) => !columnsToExclude.includes(col))
                                            .map((col, indx) => (
                                                <th key={indx}>{col.toUpperCase()}</th>
                                            ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {dupProducts.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {Object.keys(row)
                                                .filter((col) => !columnsToExclude.includes(col))
                                                .map((col, colIndex) => (
                                                    <td key={colIndex}>{row[col]}</td>
                                                ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        
                </>
                    
)}
                
            
        </div>
    );
}
            
export default PopUp;

