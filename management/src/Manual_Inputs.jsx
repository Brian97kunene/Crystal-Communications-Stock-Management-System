

import React, { useState, useMemo, useEffect } from 'react';
import MyClass from './MyMethods.js'
import searchTbl from './SearchTable.jsx'
const Manual_Inputs = ({ supplier }) => {
    const [products, setProducts] = useState([]);
    const [addproducts, setaddProduct] = useState(false);
    var t = [];
    const [formValues, setFormValues] = useState({});
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




    const handleChange = (col) => (e) => {
        const value = e.target.value;
        setFormValues(prev => ({ ...prev, [col]: value }));
    }

    const handleSubmit = () => {


        console.log(formValues);


        console.log(MyClass.insertProduct(formValues, supplier.id));

    }



    const columnsToExclude = ['id', 'detailed_description', "created_on", 'updated_on', '	livefee_updated_on', 'data_source', 'vat', 'delivery_cost', 'supplier_code','livefee_updated_on']

    return (

        <div>


            <div>

                


            </div>



            {products.length > 0 ? (

        <table className="table table-striped">
                    <thead><tr>
                        {Object.keys(products[0]).map(col => { return <><th key={col.id}>{col}</th></> })}

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
            
            ) : <p>No products found.</p>}

            <div style={{ width: "90%", display: "flex", justifyContent: "right" }}>
                <button onClick={() =>setaddProduct(!addproducts)}>Add New</button>
                            </div>
            { addproducts && (<>

                {Object.keys(products[0]).filter((col => !columnsToExclude.includes(col))).map(col => { return <><input style={{ padding: "5px", margin: "5px", borderRadius: "5px" }} placeholder={col} key={col.id} onChange={handleChange(col)}></input></> })}



                <button onClick={handleSubmit}>CREATE</button>

            </>
            )}
        </div>
    );

}
    export default Manual_Inputs;