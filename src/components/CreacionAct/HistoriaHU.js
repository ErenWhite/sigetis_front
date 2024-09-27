import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AgregarHU from './AgregarHU';
import { Modal, Button, Dropdown } from 'react-bootstrap';

function HistoriaHU() {
  const [historiasUsuario, setHistoriasUsuario] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', images: [] });
  const [editIndex, setEditIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedHistorias = localStorage.getItem('historiasUsuario');
    if (storedHistorias) {
      setHistoriasUsuario(JSON.parse(storedHistorias));
    } else {
      setHistoriasUsuario([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('historiasUsuario', JSON.stringify(historiasUsuario));
  }, [historiasUsuario]);
 const openModalForNewStory = () => {
    setEditIndex(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const saveStory = () => {
    if (newTask.title.trim()) {
      if (editIndex !== null) {
        const updatedStories = [...historiasUsuario];
        updatedStories[editIndex] = newTask;
        setHistoriasUsuario(updatedStories);
      } else {
        setHistoriasUsuario([...historiasUsuario, newTask]);
      }
      setNewTask({ title: '', description: '', images: [] });
      closeModal();
    }
  };

  const editStory = (index) => {
    setEditIndex(index);
    setNewTask(historiasUsuario[index]);
    setShowModal(true);
  };

  const deleteStory = (index) => {
    const updatedStories = historiasUsuario.filter((_, i) => i !== index);
    setHistoriasUsuario(updatedStories);
  };

  const viewStoryDetails = (index) => {
    navigate(`/detalle/${index}`, { state: { historia: historiasUsuario[index] } });
  };

  

  return (
    <div className="container mt-5" style={{ backgroundColor: '#215f88', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>HISTORIA DE USUARIO</h1>
        <button onClick={openModalForNewStory} className="btn btn-primary">
          + AGREGAR HU
        </button>
      </div>
      <div className="mb-3">
        <label>HISTORIA DE USUARIO</label>
      </div>

      <ul className="list-group">
        {historiasUsuario.map((historia, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <span onClick={() => viewStoryDetails(index)} style={{ cursor: 'pointer' }}>
              {historia.title}
            </span>
            <Dropdown>
              <Dropdown.Toggle variant="link" id="dropdown-basic">
                •••
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => editStory(index)}>Editar</Dropdown.Item>
                <Dropdown.Item onClick={() => deleteStory(index)}>Eliminar</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        ))}
      </ul>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editIndex !== null ? "Editar Historia de Usuario" : "Agregar Historia de Usuario"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AgregarHU newTask={newTask} setNewTask={setNewTask} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={saveStory}>
            {editIndex !== null ? "Actualizar" : "Crear"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default HistoriaHU;