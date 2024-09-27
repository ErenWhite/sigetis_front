import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const endPoint = 'http://localhost:8000/api/historia_usuario'; // Ajusta la URL según tu configuración

function AgregarHU({ newTask, setNewTask }) {
  const handleTitleChange = (event) => {
    setNewTask((prev) => ({ ...prev, title: event.target.value }));
  };

  const handleDescriptionChange = (event) => {
    setNewTask((prev) => ({ ...prev, description: event.target.value }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setNewTask((prev) => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Crear un objeto FormData para enviar imágenes y otros datos
    const formData = new FormData();
    formData.append('titulo_hu', newTask.title);
    formData.append('descripcion_hu', newTask.description);
    newTask.images.forEach((image) => {
      formData.append('images[]', image);
    });

    try {
      const response = await axios.post(endPoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Tarea guardada:', response.data);
      // Puedes agregar lógica adicional aquí, como limpiar el estado o mostrar un mensaje de éxito
    } catch (error) {
      console.error('Error al guardar la tarea:', error.response.data);
      // Manejo de errores aquí
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center">
      <h1 className="my-4">Agregar Historia de Usuario</h1>
      <form onSubmit={handleSubmit} className="w-50">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Título:</label>
          <input type="text" id="title" className="form-control" value={newTask.title} onChange={handleTitleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Descripción:</label>
          <textarea id="description" className="form-control" value={newTask.description} onChange={handleDescriptionChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="images" className="form-label">Imágenes:</label>
          <input type="file" id="images" className="form-control" multiple accept="image/*" onChange={handleImageUpload} />
        </div>
        <div className="mb-3">
          {newTask.images.map((image, index) => (
            <img key={index} src={URL.createObjectURL(image)} alt="Imagen" className="img-thumbnail mb-2" height="100" />
          ))}
        </div>
        <button type="submit" className="btn btn-primary">Guardar</button>
      </form>
    </div>
  );
}

export default AgregarHU;
