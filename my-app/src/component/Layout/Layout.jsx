import React from 'react';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import { Outlet } from 'react-router-dom';
// import { UserContext } from '../Context/UserContext';

const Layout = () => {
  // const { userToken } = useContext(UserContext);
  // const location = useLocation();

 

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
