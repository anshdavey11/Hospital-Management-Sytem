import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import { routes1 } from './routing/Router2.jsx'
// import {  routes1 } from './routing/Router.jsx'

createRoot(document.getElementById('root')).render(
    <RouterProvider router={routes1}>
        
    </RouterProvider>
)
