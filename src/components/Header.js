import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';



function Header() {


  return (
    <header className="bg-primary text-white py-3">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="h3 mb-0">Monitoreo de humedad y temperatura</h2>
          <nav>
            <Link to="/" className="text-white mx-2">Servidores</Link>
            <Link to="/login" className="text-white mx-2">Iniciar sesión</Link>
            <Link to="/register" className="text-white mx-2">Registro</Link>
          </nav>
        </div>

      </div>
    </header>
  );
}

export default Header;
