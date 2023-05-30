import React, {useContext} from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { userContext, pageContext } from "../context";

const RootLayout = () => {
  const { setUser } = useContext(userContext);
  const { lastPage } = useContext(pageContext);
  const { pathname: locationURL } = useLocation();

  return (
    <div className="root-layout">
      <header>
        {formatNavBar(locationURL, lastPage, setUser)}
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )

};

export default RootLayout;

const formatNavBar = (locationURL, lastPage, setUser) => {
  switch (locationURL) {
    case '/': {
      return (
        <nav id='main-nav'>
          <NavLink to='/SignUpPage' className='nav-link' > Sign-up Page </NavLink>
        </nav>
      )
    }
    case '/SignUpPage': {
      return (
        <nav id='main-nav'>
          <NavLink to='/' className='nav-link' > Login Page </NavLink>
        </nav>
      )
    }
    case '/UserHomePage': {
      return (
        <nav id='main-nav'>
          {lastPage.current === '/ScrumBoardPage' && <NavLink to='/ScrumBoardPage' className='nav-link' > Scrum Board Page </NavLink>}
          <NavLink to='/' className='nav-link' onClick={() => setUser(null)} > Log Out </NavLink>
        </nav>
      )
    }
    case '/ScrumBoardPage': {
      return (
        <nav id='main-nav'>
          <NavLink to='/UserHomePage' className='nav-link' > User Home Page </NavLink>
          <NavLink to='/' className='nav-link' onClick={() => setUser(null)} > Log Out </NavLink>
        </nav>
      )
    }
    default: {
      return (
        // If you see links to both of the below page at once, it means none of the other paths match the currrent location
        <nav id='main-nav'>
          <NavLink to='/' className='nav-link' > Login Page </NavLink>
          <NavLink to='/SignUpPage' className='nav-link' > Sign-up Page </NavLink>
        </nav>
      )
    }
  }
}

/* former navbar including all pages for testing:
    <nav id='main-nav'>
          <NavLink to='/' className='nav-link' > Login Page </NavLink>
          <NavLink to='/SignUpPage'className='nav-link' > Sign-up Page </NavLink>
          <NavLink to='/UserHomePage' className='nav-link' > User Home Page </NavLink>
          <NavLink to='/ScrumBoardPage' className='nav-link' > Scrum Board Page </NavLink>
          <NavLink to='/' className='nav-link' > Login Page </NavLink>
        </nav>

*/