import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import authContext from "../../context/authContext";

const MainNavigation = (props) => {
  const globalAuthContext = useContext(authContext);

  return (
    <header>
      <div>
        <h1>OrdTrack</h1>
      </div>
      <nav>
        <ul>
          {!globalAuthContext.token ? <li>
            <NavLink to="/auth">Authenticate</NavLink>
          </li> : <></>}
          {globalAuthContext.token ? 
          <>
          <li>
            <NavLink to="/products">List of Products</NavLink>
          </li>
          <li>
            <NavLink to="/orders">Manage Orders</NavLink>
          </li> 
          <li>
            <NavLink onClick={globalAuthContext.logout}>Logout</NavLink>
          </li>
          </>: <></> }
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
