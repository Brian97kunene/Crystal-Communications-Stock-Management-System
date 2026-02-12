import React, { useState, useEffect } from "react";
import { CSSTransition } from 'react-transition-group';
import './UsersStyle.css'

// Component to edit a single product record
const UserEditor = ({ user, onClose, onUpdated }) => {
    const [form, setForm] = useState({ name: user.name, description: user.description, sku: user.sku, retail_price: user.price, delivery_cost: user.delivery_cost, mark_up:user.mark_up, vat: user.vat ,vendor:user.vendor,quantity:user.quantity,category:user.category});
    const port = 5552;
    const [vendors, setVendors] = useState([]);



    // Load all vendors for dropdown
    useEffect(() => {
        const fetchUsers = async () => {
            try {

                const response = await fetch("http://localhost:" + port + "/vendors");
                const data = await response.json();
                setVendors(data.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);


    const handleUpdate = async () => {
        try {
            //const port = 5557;
            const response = await fetch(`http://localhost:${port}/updateuser/${user.id}`, {
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

            const updatedUser = await response.json();
            console.log("User updated:", updatedUser.data);
            onUpdated(updatedUser.data); // notify parent
            onClose(); // close editor
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };



// Component to delete a single product record
    const handleDelete = async () => {
        try {
           // const port = 5555;
            const response = await fetch(`http://localhost:` + {port} +`/deleteuser/${user.id}`, {
                method: "DELETE", // or "PATCH" if partial updates
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const updatedUser = await response.json();
            console.log("Delete Complete:", updatedUser.data);
            onUpdated(updatedUser.data); // notify parent
            onClose(); // close editor
        } catch (error) {
            console.error("Delete Error", error);
        }
    };


    return (
      

        <div  >
            <h3>Edit Product</h3>
            <br />

            <span className="tbl_headers">Name</span>
            <br /> 
            <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <br/>
            <span className="tbl_headers">Description</span>
            <br /> 
            <input
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <br/>
            <span className="tbl_headers">SKU</span>
            <br /> 
            <input
                placeholder="SKU"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
            />

            <br/>
            <span className="tbl_headers">Retail Price</span>
            <br /> 
            <input
                placeholder="Retail Price"
                value={form.retail_price}
                onChange={(e) => setForm({ ...form, retail_price: e.target.value })}
            />

            <br/>
            <span className="tbl_headers">Mark Up</span>
            <br /> 
            <input
                placeholder="Mark Up"
                value={form.mark_up}
                onChange={(e) => setForm({ ...form, mark_up: e.target.value })}
            />
            <br/>
            <span className="tbl_headers">Delivery Cost</span>
            <br /> 
            <input
                placeholder="Delivery Cost"
                value={form.delivery_cost}
                onChange={(e) => setForm({ ...form, delivery_cost: e.target.value })}
            />
            <br/>
            <span className="tbl_headers">Tax</span>
            <br /> 
            <input
                placeholder="Tax"
                value={form.vat}
                onChange={(e) => setForm({ ...form, vat: e.target.value })}/>
            <br />
            <span className="tbl_headers">Quantity</span><br />
            <input
                placeholder="Quantity"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            <br />
            <span className="tbl_headers">Category</span><br />
            <input
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })} />

            <br />
            <span className="tbl_headers">Vendor</span><br />
            <select
                value={form.vendor}
                onChange={(e) => setForm({ ...form, vendor: e.target.value })}
            >
                <option value="">Select Vendor</option>
                {vendors.map(v => (
                    <option key={v.id} value={v.name}>{v.name}</option>
                ))}
            </select>
            <br />
            

            <button onClick={handleUpdate}>Save</button>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={onClose}>Cancel</button>
            </div>

        
    );
      
};

// Main component showing list of users
const UserList = () => {

    //const [onpageshow, setOnPageShow] = useState(true)
    const port = 5552;
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);

    // toggle products visibility 
    const [ProdVisibility, setProdVisibility] = useState(false)
    



    // Load all users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
            
                const response = await fetch("http://localhost:" + port + "/userr");
                const data = await response.json();
                setUsers(data.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    // Update user in state after editing
    const handleUserUpdated = (updatedUser) => {
        setUsers(users.map(u => (u.id === updatedUser.id ? updatedUser : u)));
    };





    return (
        <div className="Products_List">
            <br />
            <button onClick={() => {
                setProdVisibility(!ProdVisibility);
            }}>View All Products</button>
            {ProdVisibility && <div>
            <h2>Products List</h2>
            <br />

          

                <table className="table table-striped"  Id="prod_table">
                <thead >
                    <tr>
                        
                        <th>SKU</th>
                        <th>PRODUCT NAME</th>
                        <th>DESCRIPTION</th>
                        <th>PRICE</th>
                        <th>DELIVERY</th>
                        <th>MARK UP</th>
                        <th>VAT</th>
                        <th>QUANTITY</th>
                        <th>CATEGORY</th>
                        <th>VENDOR</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            
                            <td>{u.sku}</td>
                            <td>{u.name}</td>
                            <td>{u.description}</td>
                            <td>{u.price}</td>
                            <td>{u.delivery_cost}</td>
                            <td>{u.mark_up}</td>
                            <td>{u.vat}</td>
                            <td>{u.quantity}</td>
                            <td>{u.category}</td>
                            <td>{u.vendor}</td>
                            
                            <td>

                            
                                <button onClick={() => setEditingUser(u)}>Edit</button>

                            
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="edit_prod_sec">
            {editingUser && (
                <UserEditor
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onUpdated={handleUserUpdated}
                />
            )}

        </div> </div>}
        </div>);
}
export default UserList;





