import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import Users from './Users.jsx'
import Suppliers from './Suppliers.jsx'





import Prod from './HandleSelectedRow.jsx'
import Prods from './App.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>           
        
        
        <Users />

        <Suppliers />

        <Prod/>

        
        
       
  </StrictMode>,
)



  