import React, { useState, useEffect } from "react";
import MyClass from "./MyMethods";
import { CSSTransition } from 'react-transition-group';
import './UsersStyle.css'


// Main component showing list of users

const ManualList = () => {
    const [products, setproducts] = useState([])




    useEffect(()  => {

        const getEm = async () => {

            
            setproducts(await MyClass.getAllDbProducts());
        }
        getEm();


    }, []);






    const columnsToExclude = ['id', 'detailed_description'];


        return (
            <div>

                {products.length > 0 && (
                    <div className="wrapper">
                <table className="table table-striped">
                    <thead>
                        <tr>
                                {Object.keys(products[0]).filter((col) => !columnsToExclude.includes(col)).map((col, indx) =>

                                <th key={indx}>{col}</th>

                            )}

                            </tr>

                        </thead>
                            <tbody>
                                <tr>
                                    {Object.entries(products[0])
                                        .filter(([key]) => !columnsToExclude.includes(key)) // filter by key
                                        .map(([key, value], indx) => (
                                            <td key={indx}>
                                                <input type="text" value={value} readOnly />
                                            </td>
                                        ))}
                                </tr>
                            </tbody>
                    </table>






                    </div>
        )}
           </div>
                );
    }

export default ManualList;
