import React from 'react'

import { Outlet } from 'react-router-dom'


const Layout1 = () => {
  return (
    <div>
       {/* <SideNav></SideNav> */}
       {/* <MainContent1/> */}
       <Outlet></Outlet> 
    </div>
  )
}

export default Layout1