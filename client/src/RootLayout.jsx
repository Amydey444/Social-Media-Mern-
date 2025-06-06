import React, { useEffect } from 'react'
import Navbar from './component/Navbar'
import Sidebar from './component/SideBar'
import Widgets from './component/Widgets'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ThemeModal from './component/ThemeModal'

const RootLayout = () => {


  const {themeModalIsOpen}=useSelector(state=>state?.ui)
  const {primaryColor,backgroundColor}=useSelector((state=>state?.ui?.theme))

  useEffect(()=>{
    const body=document.body;
    body.className=`${primaryColor} ${backgroundColor}`

  },[primaryColor,backgroundColor])
  return (
    <>
        <Navbar />
        <main className='main'>
            <div className="container main__container">
                <Sidebar />

                <Outlet />

                <Widgets />
                {themeModalIsOpen && <ThemeModal />}

            </div>

        </main>
    </>
  )
}

export default RootLayout
