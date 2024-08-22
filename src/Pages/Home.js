import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal'; // Asegúrate de que la ruta sea correcta
import '../index.css';

function Home() {

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardData, setCardData] = useState({
    Edificio: "",
    ID: "",
    Encargado: ""
  });

  useEffect(() => {
    // Obtener datos iniciales
    axios.get('http://localhost:3000/data')
      .then(response => setCardData(response.data))
      .catch(error => console.error('Error fetching data: ', error));
  }, []);



  const handleFormSubmit = (data) => {
    // Enviar datos al backend para actualizar el registro sin importar el ID
    axios.put('http://localhost:3000/data', data) // Se envía la data completa
      .then(() => {
        setCardData(data); // Actualiza los datos de la tarjeta
        setIsModalOpen(false); // Cierra el modal
      })
      .catch(error => console.error('Error updating data: ', error));
  };

  return (
    <div className="container mt-4">
      <h1>Servidor</h1>
<div className='cuadro'>
      <div className="card mb-4 mt-2">
        <div className="card-body">
          <h5 className="card-title">{cardData.Edificio}</h5>
          <h6 className="card-subtitle mb-2 text-muted">ID: {cardData.ID}</h6>
          <p className="card-text">Encargado: {cardData.Encargado}</p>
          <p className="card-text">Humedad: </p>
          <p className="card-text">Temperatura: </p>
        </div>
        <button className="btn btn-outline-info" onClick={() => setIsModalOpen(true)}>Editar</button>

      </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={cardData}
      />

      <div className='catto'>
      <button onClick={handleLogout} className="btn btn-danger mb-3">Salir</button>

      </div>

    </div>
  );
}

export default Home;
