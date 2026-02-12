import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import 'bootstrap/dist/css/bootstrap.min.css';
import Users from './Users.jsx'
import ReadAFile from './ReadAFile.jsx'
import Vendors from './Vendors.jsx'
import EditableUsers from './Products_Editable.jsx'
import Prod from './HandleSelectedRow.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>           
        <Users />
        <Prod />
        <ReadAFile />
        <EditableUsers />
        <Vendors />
  </StrictMode>,
)



  