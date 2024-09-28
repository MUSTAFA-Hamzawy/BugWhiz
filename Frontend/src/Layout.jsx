import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Components/Header/Header';

const Layout = ({children }) => {
  const location = useLocation();
  const shouldShowHeader = location.pathname !== '/login' && location.pathname !== '/signup';

  return (
    <>
      {shouldShowHeader && <Header/>}
      {children}
    </>
  );
};

export default Layout;
