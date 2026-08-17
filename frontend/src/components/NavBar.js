import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import { CartContext } from '../contexts/CartContext';

const NavBar = ({ user, onLogout }) => {
  const { cartCount } = useContext(CartContext);
  const navClass = ({ isActive }) => (isActive ? 'nav-button active' : 'nav-button');

  return (
    <header className="page-header nav-header">
      <div className="nav-brand">
        <NavLink to="/">
          <img src={logo} alt="Mobile Wholesale" className="nav-logo" />
        </NavLink>
      </div>
      <div className="nav-links">
        <NavLink end className={navClass} to="/">Home</NavLink>
        <NavLink className={navClass} to="/products">Products</NavLink>
        {user?.role === 'admin' && <NavLink end className={navClass} to="/stock-list">Stock List</NavLink>}
        <NavLink end className={navClass} to="/gallery">Gallery</NavLink>
        <NavLink end className={navClass} to="/blog">Blog</NavLink>
        <NavLink end className={navClass} to="/about">About</NavLink>
        {user?.role !== 'admin' && (
          <NavLink end className={navClass} to="/checkout" style={{ position: 'relative' }}>
            🛒 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </NavLink>
        )}
        {user ? (
          <>
            {user.role === 'admin' ? <NavLink className={navClass} to="/admin">Admin</NavLink> : <NavLink className={navClass} to="/dashboard">Dashboard</NavLink>}
            <button className="button logout-button" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink className={navClass} to="/login">Login</NavLink>
            <NavLink className={navClass} to="/register">Register</NavLink>
          </>
        )}
      </div>
    </header>
  );
};

export default NavBar;
