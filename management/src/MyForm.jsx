import React from "react";

const PopupExample = ({product,val,close }) => {




    return (
        <div>
            {/* Button to open popup */}
            

            {/* Popup */}
            {val && (
                <div style={styles.overlay}>
                    <div style={styles.popup}>


                      
                        
                            <h6 key={product.id}>{product.name}</h6>
                            <h5>PRICE: {product.price}</h5>
                            <h5>MARK UP: {product.mark_up}</h5>
                            <h5>Brand: {product.vendor}</h5>
                            <h5>{product.category}</h5>
                            <h5>QTY: {product.quantity}</h5>
                            
                           

                        <button onClick={close}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Simple inline styles for demo
const styles = {
    overlay: {
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex", justifyContent: "center", alignItems: "center"
    },
    popup: {
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        minWidth: "300px",
        textAlign: "center"
    }
};

export default PopupExample;
