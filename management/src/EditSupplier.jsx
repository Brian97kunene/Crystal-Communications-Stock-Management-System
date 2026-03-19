import React, { useState, useEffect } from "react";
function EditSupplier(Supplier) {
    const [supplier, setsupplier] = useState({ name: Supplier.name, address: Supplier.address, contact_name: Supplier.contact_name, contact: Supplier.contact, email: Supplier.email, data_format: Supplier.data_format, id: Supplier.id });




    const port = 5552;




    useEffect(() => {
        const fetchSuupData =  () => {


            setsupplier(Supplier.supplier)
            console.log(supplier);
            console.log(Supplier.supplier);
         
        };
        fetchSuupData();
    }, []);


    // handle submit data
    const close =  () => {
    
        setsupplier({ name: "", address: "", contact_name: "", contact: "", email: "", data_format: "", id: 0})

    }
    const handleSubmit = async () => {
        try {
            const response = await fetch("http://localhost:" + port + "/updatevendor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(supplier)
            }); if (!response.ok) {
                console.log(supplier);
                throw new Error(`HTTP error! Status: ${response.status}`);
            } const data = await response.json();
            console.log("User added:", data.data);
            //setUsers(data);
        } catch (error) {
            console.error("Error posting data:", error);
        }
    }





    return (
        <div style={{ display: "flex", justifyContent: "right", width:"50%",padding:"5px",margin:"00px 0px 0px 00px" }}>
        <div>


      
            <input type="text"  className="form-control" value={supplier.name}           placeholder="Supplier Name" onChange={(e) => setsupplier({ ...supplier, name: e.target.value })} /><br />
            <input type="text" class="form-control" value={supplier.contact}        placeholder="Supplier contact" onChange={(e) => setsupplier({ ...supplier, contact: e.target.value })} /><br />
            <input type="text" className="form-control" value={supplier.contact_name}   placeholder="Supplier contact_name" onChange={(e) => setsupplier({ ...supplier, contact_name: e.target.value })} /><br />
        
            <input type="text" className="form-control" value={supplier.email}         placeholder="Supplier email" onChange={(e) => setsupplier({ ...supplier, email: e.target.value })} /><br />
            <input type="text" className="form-control" value={supplier.address}       placeholder="Supplier address" onChange={(e) => setsupplier({ ...supplier, address: e.target.value })} /><br />
            <input type="text" className="form-control" value={supplier.data_format}   placeholder="Supplier data_format" onChange={(e) => setsupplier({ ...supplier, data_format: e.target.value })} /><br />


                        <button onClick={handleSubmit} className="btn btn-primary">SAVE</button>
                        <button onClick={() => close } className="btn btn-primary">close</button>
        </div>
        </div>
  );
}

export default EditSupplier;