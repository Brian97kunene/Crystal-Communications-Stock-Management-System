

import React, { useState, useMemo, useEffect } from 'react';
import MyClass from './MyMethods.js'
import searchTbl from './SearchTable.jsx'
const Manual_Inputs = ({ supplier }) => {
    const [products, setProducts] = useState([]);
    var t = [];

    useEffect(() => {
        const fetchUsers = async () => {


            try {

                const response = await fetch("http://localhost:5552/api/getproducts/bysuppliercode/" + supplier.id);

                const data = await response.json();


                console.log(data);
                setProducts(data.data);


            } catch (err) { }

            console.log(products);

            var y = Array.from(Object.values(products));


            for (var i in y){

            console.log(i);
            console.log(Object.values(i));
            }



            console.log("in there");
            //console.log(await Object.values(products[0]));
            t = y;
            console.log(t);
            console.log(y);
        }

        fetchUsers();
    }, []);

    const columnsToExclude = ['id', 'detailed_description']

    return (

        <div>


            <div>

                


            </div>



            {products.length > 0 ? (

        <table className="table table-striped">
                    <thead><tr>
                        {Object.keys(products[0]).map(col => { return <><th key={col.id}>{col.toUpperCase()}</th></> })}

                </tr>
            </thead>
            <tbody>
                           
                                
                            {products.map((row ,kk)=>
                                <tr key={ kk}>
                            {
                                        Object.keys(row).map((col, k) =>
                                

                                    <td key={k}>{row[col]}</td>
                               

                            )}
                           

                        </tr>
                            )}  
            </tbody>
        </table>
            
            )  : <p>No products found.</p>}
        </div>
    );

}
    export default Manual_Inputs;