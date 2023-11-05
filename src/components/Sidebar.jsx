import React, { useState } from 'react';
import{
    FaRightFromBracket,
    FaChartSimple,
    FaCalendarDays,
    FaCalendarDay,
    FaGear,
    FaUser,
    FaWallet,
    FaBars,
} from"react-icons/fa6";
import { NavLink, useLocation } from 'react-router-dom';
const Sidebar = ({children}) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen (!isOpen);

    const location = useLocation();


    const menuItem =[
        
        {
            path:"/dashboard",
            name:"Dashboard",
            icon:<FaChartSimple/>
        },
        {
            path:"/all",
            name:"All",
            icon:<FaCalendarDays/>
        },
        {
            path:"/today",
            name:"Today",
            icon:<FaCalendarDay/>
        },
        {
            path:"/settings",
            name:"Settings",
            icon:<FaGear/>
        },
        {
            path:"/account",
            name:"Account",
            icon:<FaUser/>
        },
        {
            path:"/budget",
            name:"Budget",
            icon:<FaWallet/>
        },
    ]

    const isLandingPage = location.pathname === '/';
    
    const handleLogout = () => {
        // Remove the access token from local storage
        localStorage.removeItem('accessToken');
    
        window.location.href = '/';
      };
    

  return (
    <div className="container1">
    {!isLandingPage && (
      <div style={{ width: isOpen ? '250px' : '50px' }} className="sidebar">
        <div className="top_section">
          <h1 style={{ display: isOpen ? 'block' : 'none' }} className="logo">
            GastosKo
          </h1>
          <div style={{ marginLeft: isOpen ? '50px' : '0px' }} className="bars">
            <FaBars onClick={toggle} />
          </div>
        </div>
        {menuItem.map((item, index) => (
          <NavLink to={item.path} key={index} className="link" activeClassName="active">
            <div className="icon">{item.icon}</div>
            <div style={{ display: isOpen ? 'block' : 'none' }} className="link_text">
              {item.name}
            </div>
          </NavLink>
        ))}

        {/* Render the Logout item separately */}
        <div className="bottom-link" onClick={handleLogout} style={{ width: isOpen ? '222px' : '50px' }}>
          <div className="icon" >
            <FaRightFromBracket />
          </div>
          <div style={{ display: isOpen ? 'block' : 'none', cursor: "pointer"}} className="link_text" >
            Logout
          </div>
        </div>
      </div>
    )}
    <main>{children}</main>
  </div>
  )
}

export default Sidebar
