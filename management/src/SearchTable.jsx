import React, { useState } from "react";

const TableWithSearch = ({data, search}) => {
   
    const [searchReturn, setsearchReturn] = useState([]);

    // Filter rows based on search input
    const filteredRows = data.filter((row) => {
        try {
            // 1. Ensure the search term is a string
            const searchTerm = String(search).toLowerCase();

            // 2. Safely convert the row's SKU to a string (handles numbers or nulls)
            const rowSku = row.sku ? String(row.sku).toLowerCase() : "";

            // 3. Check if the SKU contains the search term
           // console.log(rowSku);

            return rowSku.includes(searchTerm);
        } catch (err) {
            console.error("Error filtering rows: ", err);
            return false;
        }
    });

    return (
        <div>
        

            <table class="table table-striped" border="1" style={{ marginTop: "10px", width: "100%" }}>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>SKU</td>
                        <td style={{ backgroundColor: "black", color: "white", fontWeight: "bold" }}>Price</td>
                        <td>Vendor</td>
                        <td>Category</td>
                        <td>Quantity</td>
                        <td>RRP</td>
                        <td style={{ backgroundColor: "black", color: "white", fontWeight: "bold" }}>Updated:</td>
                    </tr>
                </thead>
                <tbody>
                    {filteredRows.map((row) => (
                        <tr key={row.sku}>
                            <td>{row.name}</td>
                            <td>{row.sku}</td>
                            <td style={{ backgroundColor: "black", color: "white", fontWeight: "bold" }}>R{row.price}</td>
                            <td>{row.attributes.brand}</td>
                            <td>{row.categorytree}</td>
                            <td>CPT:{row.cptstock}, JHB:{row.jhbstock} DBN:{row.dbnstock}, TOTAL:{row.dbnstock + row.cptstock + row.jhbstock}</td>
                            <td>{row.recommended_margin}%</td>
                            <td style={{ backgroundColor: "black", color: "white", fontWeight: "bold" }}>{row.last_modified}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableWithSearch;
