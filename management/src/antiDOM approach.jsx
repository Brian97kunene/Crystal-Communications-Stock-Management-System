import React, { useState, useMemo, useEffect } from 'react';
import MyClass from './MyMethods.js'
import searchTbl from './SearchTable.jsx'

const ProductTable = ({ initialProducts }) => {
  // 1. Store products in a Map for fast O(1) updates
  const [productMap, setProductMap] = useState(new Map(initialProducts.map(p => [p.sku, p])));



    useEffect(() => {
        setProductMap(new Map(initialProducts.map(p => [p.sku, p])));
        console.log("INITIALLY: ", initialProducts);

        if (initialProducts.length > 0) {
            setselectedSupp(initialProducts[0].supplier_code);
            console.log(selectedSupp);
             setsearchbyfield("Name");
        }
    }, [initialProducts]);






    const [searchTerm, setSearchTerm] = useState("");
  // 2. Local state for the bulk input fields
  const [bulkMarkup, setBulkMarkup] = useState("");
  const [bulkDelivery, setBulkDelivery] = useState("");
    const [selectedSkus, setSelectedSkus] = useState(new Set());
    const [selectedSupp, setselectedSupp] = useState(null);
    const [editting, seteditting] = useState(false);
    const [searchfield, setsearchfield] = useState([]);
    const [searchbyfield, setsearchbyfield] = useState("");
    const [searchproducts, setsearchproducts] = useState([]);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);







    const show = (x) => {

        selectedSkus.forEach(p => console.log(p))

    }
    const deleteProduct = async () => {

        selectedSkus.forEach(p => console.log(p))

        try {

            var response = await MyClass.deleteProducts(selectedSkus, selectedSupp);

            console.log(response);

        }
        catch (err) {

            console.log(err);
        }
    }




    const toggleSelect = (sku) => {
        const newSelection = new Set(selectedSkus);
        if (newSelection.has(sku)) {
            newSelection.delete(sku);
        } else {
            newSelection.add(sku);
        }
        setSelectedSkus(newSelection);

        console.log(newSelection);
    };

    // To handle the "Select All" header checkbox
    const toggleAll = () => {

        if (selectedSkus.size === productList.length) {
            setSelectedSkus(new Set()); // Deselect all
        } else {
            setSelectedSkus(new Set(productList.map(p => p.sku))); // Select all
        };
    }


  const sync = async (x) => {

      var t = await MyClass.syncProducts(x);
      alert(JSON.stringify(x.supplier)+" queued")


      console.log(t);
    };

    const handleSaveAll_ = (x) => {
        if (selectedSkus.size === 0) {
            alert("Please select at least one row to edit.");
            return;
        }

        const newMap = new Map(productMap);

        // Loop only through the selected SKUs for efficiency
        selectedSkus.forEach(sku => {
            const product = newMap.get(sku);
            if (!product) return;

            const markupVal = bulkMarkup !== "" ? Number(bulkMarkup) : (Number(product.mark_up) || 0);
            const deliveryVal = bulkDelivery !== "" ? Number(bulkDelivery) : (Number(product.delivery_cost) || 0);
            const vat = (Number(product.vat) || 0) / 100;

            const totalCost = (Number(product.price) || 0) + deliveryVal;
            const finalPrice = (totalCost * (1 + (markupVal / 100)) * (1 + vat)).toFixed(2);

            newMap.set(sku, {
                ...product,
                price_after_mark_up: finalPrice,
                delivery_cost: deliveryVal,
                mark_up: markupVal
            });
        });


        setProductMap(newMap);
        setSelectedSkus(new Set()); // Optional: clear selection after saving

        if (x === true) {

        MyClass.updateProducts(Array.from(newMap.values()), selectedSupp);


        }
        
    };



   
    const search_ = () => {
        try {


            







        //    console.log(" search by " + searchbyfield);
       //     console.log(searchTerm + " " );
          //  searchDb_(searchTerm, searchbyfield);
       

            //console.log(initialProducts);


            const search = 'al';
            const matches = [];

            initialProducts.filter(user => {
              //  console.log(searchTerm + " " + user.sku.toLowerCase());
                user.sku.toLowerCase().includes(searchTerm.toLowerCase())
                // console.log(user.sku.toLowerCase().includes(searchTerm.toLowerCase()));


                if (searchbyfield == "SKU") {
                    if (user.sku.toLowerCase().includes(searchTerm.toLowerCase())) {
                        matches.push(user)
                        console.log(user);
                            console.log(user + " " + searchbyfield);
                    }
                }

                    else {
                        if (user.name.toLowerCase().includes(searchTerm.toLowerCase())) {

                            matches.push(user)
                            console.log(user + " " + searchbyfield);
                        }
                }
            
        }
            );


            setsearchproducts(matches)
            console.log(matches + " - "+ searchbyfield);
            // Result: [{Alice}]


        }
        catch (err) {

            console.log(err);
        }
    }



















 
    const searchDb_ = async (xx, by) => {
        try {
            setLoading(true); // show spinner

            setProgress(0);


            let response;
            if (by === "Name") {
                response = await fetch(`http://localhost:5552/getproduct/byname/${xx}`);
            } else {
                response = await fetch(`http://localhost:5552/getproduct/bysku/${xx}`);
            }
            const interval = setInterval(() => {
                setProgress((prev) => (prev < 100 ? prev + 10 : prev));
            }, 1000);
            const data = await response.json();
            setsearchproducts(data.data);
            console.log(xx);
            console.log(searchproducts, " search prods");

            //clearInterval(interval);
        } catch (err) {
            console.error("Error fetching products:", err);
            setTimeout(() => {
                setLoading(false);
                setProgress(0); // reset after short delay
            }, 1000);

            // must add error message and feedback


        } finally {
            setTimeout(() => {
                setLoading(false);
                setProgress(100); // reset after short delay
            }, 1000); // hide spinner
        }
    };


    const columnsToExclude = ['id', 'detailed_description']



    const upsert = async () => {


        const y = await MyClass.getLiveProducts();
        console.log( y);

        const response = await fetch(`http://localhost:5552/api/bulk-upsert`, {
            method: "POST", // or "PATCH" if partial updates
            headers: {
                "Content-Type": "application/json"

            },
            body: JSON.stringify({ rows: y}),
        });

        console.log(response);
        console.log(initialProducts[0]); 

    }

    const [colo, setcolo] = useState(""); 

    // Convert Map back to array for rendering
  const productList = useMemo(() => Array.from(productMap.values()), [productMap]);

    return (
        <div >
            <div class="search_area">
                <span style={{ marginTop: "10px", marginLeft: "00px" }}>SEARCH FEED:</span>
                <input type="text" onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search products..."
                    style={{ marginTop: "10px", marginBottom: "10px", marginRight: "20px", padding: "5px", width: "250px" }}
                />
                <span style={{ marginTop: "50px", marginLeft: "60px" }}>SEARCH BY:</span>
                <select id="search_d" onChange={(e) => {
                    setsearchbyfield(e.target.value);
                    console.log("changed ", searchbyfield);
                }} style={{ marginTop: "10px", marginLeft: "5px", marginBottom: "10px", padding: "5px", width: "250px" }}>
                <option>Name</option>
                <option>SKU</option>
                </select>

                <button  onClick={search_}>SEARCH</button>
               {/* <button onClick={upsert}>UPSERT</button>*/}
               




                {/*<label for="exampleColorInput" class="form-label">Color picker</label>*/}
                {/*<input type="color" class="form-control form-control-color" id="exampleColorInput" value="#563d7c" onchange={(e)=>setcolo(e.target.value)} title="Choose your color"></input>*/}



            </div>





            {searchTerm && (<><h1 style={{ marginTop: "0px", marginRight: "00px" }}>Showing Database results of: "{searchTerm}"</h1>
           
                {(searchproducts.length > 0) && (< div class="wrappe" style={{
                    width: "100%",
                    marginLeft: "0px"
                }} >
                   


                    
                    <table className="table table-striped">
                        <thead>
                                <tr>
                                    {Object.keys(searchproducts[0]).filter((col) => !columnsToExclude.includes(col)).map((col, indx) => 

                                    <th key={indx}>{col}</th>

                                )}

                            </tr>
                        </thead>
                        <tbody>
                            {searchproducts.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {Object.keys(row).filter((col) => !columnsToExclude.includes(col)).map((col, colIndex) => (
                                        <td key={colIndex}>
                                            {row[col]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div >
                )
                }
            </>)}
            
            <div >
            
                <button style={{ margin: "50px 20px 20px 0px" }} onClick={() => { handleSaveAll_() }}>PREVIEW</button>
                <button style={{ margin: "0px 20px 0px 0px" }} onClick={() => { handleSaveAll_(true) }}>SAVE </button>
                <button style={{ margin: "0px 20px 0px 0px" }} onClick={() => { sync() }}>SYNC SELECTED</button>
                <button style={{ margin: "0px 20px 0px 0px" }} onClick={deleteProduct}>Delete</button>
                <input
                    type="text"
                    value={bulkDelivery}
                    onChange={(e) => setBulkDelivery(e.target.value)}
                    placeholder="Delivery Cost..."
                    style={{ margin: "0px 20px 0px 0px" }}
                /><input
                    type="text"
                    value={bulkMarkup}
                    onChange={(e) => setBulkMarkup(e.target.value)}
                    placeholder="Markup % ..."
                    />
               
      <table className="table table-striped">
      <thead>
        <tr>
                  <th>
                  <input
                      type="checkbox"
                      onChange={toggleAll}
                      checked={productList.length > 0 && selectedSkus.size === productList.length}
                  />
                            </th>
<th>NAME</th>
<th>SKU</th>
<th>PRICE</th>
<th>PRICE_+_MARK_UP</th>
<th>DELIVERY_COST</th>
<th>MARK_UP</th>
<th>QUANTITY</th>
<th>LAST_UPDATE</th>
<th>Is_Synced?</th>
<th>Has_Duplicate?</th>
<th></th>
                          

                            {/*{Object.keys(productList[0]).filter((col) => !columnsToExclude.includes(col)).map((col, indx) =>*/}

                            {/*    <th key={indx}>{col}</th>*/}

                            {/*)}*/}
        
        </tr>
      </thead>
          <tbody>
              {productList.map((row) => (
                  <tr key={row.sku}>
                      <td><input
                          type="checkbox"
                          checked={selectedSkus.has(row.sku)}
                          onChange={() => toggleSelect(row.sku)}
                      /></td>
            <td>{row.name}</td>
            <td>{row.sku}</td>
                      <td>
                          {editting && (<>
                              <input type="text" value={ row.price}></input>
                          </>
                          )
                          }

                       

                          {editting === false && (<>
                              R{row.price}
                          </>
                          )
                          }

                      </td>
            <td>R{row.price_after_mark_up}</td>
            <td>R{row.delivery_cost}</td>
                      <td>{row.mark_up}%</td>
                      {row.quantity === null && <>
                          <td className="table-danger">0</td>
                      </>
                      }
                      {row.quantity === 0 && <>
                          <td className="table-danger">{row.quantity}</td>
                      </>
                      }
                      {row.quantity >= 1 && row.quantity < 5 && <>
                          <td className="table-warning">{row.quantity}</td>
                      </>
                      }
                      {row.quantity >= 5 && <>
                          <td >{row.quantity}</td>
                      </>
                      }
                      {row.updated_on && <td >{MyClass.formatDate(row.updated_on)} </td> }
             
                
                      <td>{typeof row.is_synced === "boolean" ? row.is_synced.toString().toUpperCase() : row.is_synced}</td>
                      {row.is_duplicate.toString() === "true" ?

                          <td ><p className="alert-danger alert" style={{ textAlign: "center" }} >YES</p></td> : <td ><p className="alert-success alert" style={{ textAlign: "center" }} >NO</p></td>
                      }
                      <td><button onClick={()=>sync(row) }>Queue</button></td>
          </tr>
                        ))}

                        {/*<tr>*/}
                        {/*{Object.values(productList).map((col, indx) =>*/}

                        {/*    <td key={indx}>{col}</td>*/}

                        {/*)}*/}
                        {/*</tr>*/}

      </tbody>
    </table>
      </div>
      </div>
      
    
      
  );
}

export default ProductTable;