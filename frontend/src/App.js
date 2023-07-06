import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

import AuthPage from './pages/Auth'
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/authContext';
import { useEffect, useState } from 'react';
import Products from './pages/Products';
import Orders from './pages/Orders';


function App() {
  const [token, setToken] = useState(null);
  const [id, setId] = useState(null);

  useEffect(()=>{
    const token = localStorage.getItem('token')
    const id = localStorage.getItem('userId')
    if(token && id){
      setToken(token);
      setId(id);
    }
  },[])

  const login = (token, id) => {
    if(token){
      localStorage.setItem('token',token);
      localStorage.setItem('userId', id);
      setToken(token);
      setId(id);
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    setToken(null);
    setId(null);
  }

  return (
    <AuthContext.Provider value={{
      token: token,
      userId: id,
      login: login,
      logout: logout
    }}>
      <MainNavigation/>
      <Routes>
        <Route path='/' element={<Navigate to={'/auth'}></Navigate>}></Route>
        <Route path='/auth' element={token ? <Navigate to={'/products'}></Navigate> : <AuthPage></AuthPage>}></Route> 
        <Route path='/orders' element={token ? <Orders></Orders> : <AuthPage></AuthPage>}></Route> 
        <Route path='/products' element={token ? <Products></Products> : <AuthPage></AuthPage>}></Route> 
        <Route path='/logout' action={logout}></Route>
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
