import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'


import Users from './Users.jsx'
import ReadAFile from './ReadAFile.jsx'
import Vendors from './Vendors.jsx'
import EditableUsers from './Products_Editable.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>           
        <Users />
        <ReadAFile />
        <EditableUsers />
        <Vendors />
  </StrictMode>,
)



  