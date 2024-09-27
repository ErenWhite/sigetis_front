import React, { useState } from 'react';

const AsignarUsuario = ({ show, onHide, handleAsignarUsuario, currentTask }) => {
  const [selectedUser, setSelectedUser] = useState(currentTask?.assigned || 'No asignado');

  if (!show) return null;

  const handleChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleAssign = () => {
    handleAsignarUsuario(selectedUser);
    onHide(); // Cierra el modal después de asignar
  };

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content">
        <h2>Asignar usuario</h2>
        <select value={selectedUser} onChange={handleChange}>
          <option value="No asignado">No asignado</option>
          <option value="usuario1">Usuario 1</option>
          <option value="usuario2">Usuario 2</option>
          <option value="usuario3">Usuario 3</option>
        </select>
        <div className="mt-3">
          <button className="btn btn-primary" onClick={handleAssign}>
            Asignar
          </button>
          <button className="btn btn-secondary" onClick={onHide}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AsignarUsuario