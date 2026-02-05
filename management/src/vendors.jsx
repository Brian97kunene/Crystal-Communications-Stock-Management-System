import React, { useState, useEffect } from "react";
import './UsersStyle.css'





// Component to edit a single product record
const VendorEditor = ({ vendor, onClose, onUpdated }) => {
    const [form, setForm] = useState({ name: vendor.name, contact_name: vendor.contact_name, contact: vendor.contact, email: vendor.email, address: vendor.address});
    const port = 5552;
    const handleUpdate = async () => {
        try {
            //const port = 5557;
            const response = await fetch(`http://localhost:${port}/updatevendor/${vendor.id}`, {
                method: "PUT", // or "PATCH" if partial updates
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });
            console.log(form.data);
            //console.log(form.data);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const updatedvendor = await response.json();
            console.log("vendor updated:", updatedvendor.data);
            window.prompt("vendor updated");
            alert("vendor updated");

            onUpdated(updatedvendor.data); // notify parent
            onClose(); // close editor
        } catch (error) {
            console.error("Error updating vendor:", error);
        }
    };



    // Component to delete a single product record
    const handleDelete = async () => {
        try {
            // const port = 5555;
            const response = await fetch(`http://localhost:` + { port } + `/deletevendor/${vendor.id}`, {
                method: "DELETE", // or "PATCH" if partial updates
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const updatedvendor = await response.json();
            console.log("Delete Complete:", updatedvendor.data);
            onUpdated(updatedvendor.data); // notify parent
            onClose(); // close editor
        } catch (error) {
            console.error("Delete Error", error);
        }
    };




    return (


        <div style={{ border: "1px solid gray", padding: "10px", marginTop: "10px" }}>
            <h3>Edit Vendor</h3>
            <br />

            <span className="tbl_headers">Name</span>
            <br />
            <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <br />
            <span className="tbl_headers">Contact Name</span>
            <br />
            <input
                placeholder="Contact Name"
                value={form.contact_name}
                onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
            />
            <br />
            <span className="tbl_headers">Contact</span>
            <br />
            <input
                placeholder="Contact"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
            />

            <br />
            <span className="tbl_headers">Email</span>
            <br />
            <input
                placeholder="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <br />
            <span className="tbl_headers">Address</span>
            <br />
            <input
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
           
            
            <br />
            <button onClick={handleUpdate}>Save</button>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={onClose}>Cancel</button>
        </div>


    );

};




const Vendors = () => {

    //const [onpageshow, setOnPageShow] = useState(true)
    const port = 5552;
    const [vendors, setvendors] = useState([]);
    const [editingVendor, seteditingVendor] = useState(null);
    // toggle vendor visibility
    const [VendorVisibility, setVendorVisibility] = useState(false)
    // Load all vendors
    useEffect(() => {
        const fetchvendors = async () => {
            try {

                const response = await fetch("http://localhost:" + port + "/vendors");
                const data = await response.json();
                setvendors(data.data);
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





    return (


        <div className="vendor_List">

            <button onClick={() => {

                setVendorVisibility(!VendorVisibility);

            }}>View All Vendor</button>
            <br />

            {VendorVisibility && <div>
                <h2>Vendors List</h2>
                <br />



                <table className="vendor_table" Id="vendor_table">
                    <thead >
                        <tr>


                            <th>NAME</th>
                            <th>CONTACT</th>
                            <th>CONTACT NAME</th>
                            <th>EMAIL</th>
                            <th>ADDRESS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.map(u => (
                            <tr key={u.Id}>


                                <td>{u.name}</td>
                                <td>{u.contact}</td>
                                <td>{u.contact_name}</td>
                                <td>{u.email}</td>
                                <td>{u.address}</td>


                                <td>
                                    <button onClick={() => seteditingVendor(u)}>Edit</button>


                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="edit_vendor_sec">
                    {editingVendor && (
                        <VendorEditor
                            vendor={editingVendor}
                            onClose={() => seteditingVendor(null)}
                            onUpdated={handlevendorUpdated}
                        />
                    )}

                </div>


            </div>}


        </div>
    );
}
            
export default Vendors;

