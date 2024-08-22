import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de que Bootstrap esté importado

const Modal = ({ isOpen, closeModal, initialData }) => {
  const [cardData, setCardData] = useState({
    Edificio: "",
    ID: "",
    Encargado: ""
  });

  useEffect(() => {
    // Cargar datos iniciales cuando se abre el modal
    if (isOpen) {
      console.log("Cargando datos iniciales:", initialData);
      setCardData(initialData);
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Cambiando ${name}:`, value);
    setCardData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Enviando datos:", cardData);

    try {
      // Envía los datos actualizados al servidor
      const response = await fetch('http://localhost:3000/data', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cardData)
      });

      if (response.ok) {
        alert('Datos actualizados exitosamente');
        closeModal(); // Cerrar el modal después de actualizar
      } else {
        const errorText = await response.text();
        console.error('Error en la respuesta del servidor:', errorText);
        alert('Hubo un error al actualizar los datos');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert('Hubo un error al actualizar los datos');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Datos</h5>
            <button type="button" className="btn-close" onClick={closeModal}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="Edificio" className="form-label">Edificio y salón:</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="Edificio" 
                  value={cardData.Edificio} 
                  onChange={handleChange} 
                  placeholder="Introducir edificio y salón" 
                  required 
                />
              </div>
              <div className="mb-3">
                <label htmlFor="ID" className="form-label">ID:</label>
                <input 
                  type="number" 
                  className="form-control" 
                  name="ID" 
                  value={cardData.ID} 
                  onChange={handleChange} 
                  placeholder="Introducir ID" 
                  required 
                />
              </div>
              <div className="mb-3">
                <label htmlFor="Encargado" className="form-label">Encargado:</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="Encargado" 
                  value={cardData.Encargado} 
                  onChange={handleChange} 
                  placeholder="Introducir encargado" 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary">Editar</button>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
