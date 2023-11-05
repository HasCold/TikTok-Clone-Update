import React from 'react'
import {usePathname} from 'next/navigation'
import NavBar from './includes/NavBar'
import SideNavMain from './includes/SideNavMain'

const MainLayout = ({children} : { children: React.ReactNode}) => {
  const pathname = usePathname()
  
    return (
    <>
    <NavBar />
    <div className={`flex justify-between mx-auto w-full lg:px-2.5 px-0 ${pathname === '/' ? 'max-w-[1140px]' : ''}`}>
        <SideNavMain />
        {children}
    </div>
    </>    
  )
}

export default MainLayout