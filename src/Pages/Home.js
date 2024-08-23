import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
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
    Encargado: "",
    Humedad: "",
    Temperatura: "",
    Movimiento: ""  // Estado para los datos del sensor
  });

  useEffect(() => {
    // Obtener datos desde Redis a través del backend de Node.js
    axios.get('http://localhost:3000/data')
      .then(response => {
        const data = response.data;
        setCardData({
          Edificio: data.Edificio || "",
          ID: data.ID || "",
          Encargado: data.Encargado || "",
          Humedad: data.humedad || "",        
          Temperatura: data.temperatura || "",
          Movimiento: data.motion_detected || "" 
        });
      })
      .catch(error => console.error('Error fetching data: ', error));
  }, []);

  const handleFormSubmit = (data) => {
    // Enviar datos al backend para actualizar el registro
    axios.put('http://localhost:3000/data', data)
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
            <p className="card-text">Humedad: {cardData.Humedad}</p>
            <p className="card-text">Temperatura: {cardData.Temperatura}</p>
            <p className="card-text">
              Movimiento: {cardData.Movimiento === "1" ? "Alarma activada" : "Alarma apagada"}
            </p>
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
