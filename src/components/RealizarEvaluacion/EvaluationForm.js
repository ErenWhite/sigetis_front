import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EvaluationForm.css';

const EvaluationForm = () => {
  const navigate = useNavigate();
  const [criterios, setCriterios] = useState([]);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    cargarCriterios();
  }, []);

  const cargarCriterios = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/criterios');
      console.log('Respuesta de criterios:', response.data); // Verifica la respuesta
      const datos = Array.isArray(response.data) ? response.data : [];
      setCriterios(datos);
      // Cargar preguntas para cada criterio
      await Promise.all(datos.map(criterio => cargarPreguntas(criterio.id)));
    } catch (error) {
      console.error('Error al obtener los criterios:', error);
      setCriterios([]);
    }
  };

  const cargarPreguntas = async (criterioId) => {
    try {
      const [opcionMultipleResponse, puntuacionResponse, complementoResponse] = await Promise.all([
        axios.get(`http://localhost:8000/api/preguntasOpcionMultiple?criterioId=${criterioId}`),
        axios.get(`http://localhost:8000/api/preguntasPuntuacion?criterioId=${criterioId}`),
        axios.get(`http://localhost:8000/api/preguntasComplemento?criterioId=${criterioId}`)
      ]);

      const opcionMultiple = Array.isArray(opcionMultipleResponse.data) ? opcionMultipleResponse.data : [];
      const puntuacion = Array.isArray(puntuacionResponse.data) ? puntuacionResponse.data : [];
      const complemento = Array.isArray(complementoResponse.data) ? complementoResponse.data : [];

      // Cargar opciones para cada pregunta de opción múltiple
      await Promise.all(opcionMultiple.map(async (pregunta) => {
        try {
          const opcionesResponse = await axios.get(`http://localhost:8000/api/opcionesPreguntaMultiple?id_pregunta_multiple=${pregunta.id}`);
          pregunta.opciones = Array.isArray(opcionesResponse.data) ? opcionesResponse.data : [];
        } catch (error) {
          console.error(`Error al obtener opciones para la pregunta ${pregunta.id}:`, error);
          pregunta.opciones = []; // Asegúrate de manejar errores
        }
      }));

      setCriterios(prevCriterios => prevCriterios.map(criterio => {
        if (criterio.id === criterioId) {
          return { ...criterio, opcionMultiple, puntuacion, complemento };
        }
        return criterio;
      }));
    } catch (error) {
      console.error('Error al obtener las preguntas:', error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleFinish = async () => {
  const allAnswered = criterios.every(criterio =>
    (criterio.opcionMultiple || []).every(pregunta => responses[pregunta.id]) &&
    (criterio.puntuacion || []).every(pregunta => responses[pregunta.id]) &&
    (criterio.complemento || []).every(pregunta => responses[pregunta.id])
  );

  if (!allAnswered) {
    alert('Por favor, responda todas las preguntas.');
    return;
  }

  try {
    const promises = [];
    criterios.forEach(criterio => {
      (criterio.opcionMultiple || []).forEach(pregunta => {
        const respuestaId = responses[pregunta.id];
        if (respuestaId) {
          promises.push(guardarRespuestaOpcionMultiple(pregunta.id, respuestaId));
        }
      });
      (criterio.puntuacion || []).forEach(pregunta => {
        const puntuacion = responses[pregunta.id];
        if (puntuacion) {
          promises.push(guardarRespuestaPuntuacion(pregunta.id, puntuacion));
        }
      });
      (criterio.complemento || []).forEach(pregunta => {
        const respuesta = responses[pregunta.id];
        if (respuesta) {
          promises.push(guardarRespuestaComplemento(pregunta.id, respuesta));
        }
      });
    });

    await Promise.all(promises);
    alert('Evaluación terminada y respuestas guardadas');
    navigate('/evaluacion');
  } catch (error) {
    console.error('Error al guardar las respuestas:', error);
    alert('Hubo un problema al guardar las respuestas. Inténtalo de nuevo.');
  }
};

  const guardarRespuestaOpcionMultiple = async (preguntaId, respuestaId) => {
    const grupoEvaluacionId = 1; // Cambia esto según tu lógica de negocio
    return await axios.post('http://localhost:8000/api/respuestasOpcionMultiple', {
      id_opcion_pregunta_multiple: respuestaId,
      estado_respuesta_opcion_multiple: 1,
      id_grupo_evaluacion: grupoEvaluacionId,
    });
  };

  const guardarRespuestaPuntuacion = async (preguntaId, puntuacion) => {
    const grupoEvaluacionId = 1; // Cambia esto según tu lógica de negocio
    return await axios.post('http://localhost:8000/api/respuestasPuntuacion', {
      id_pregunta_puntuacion: preguntaId,
      respuesta_puntuacion: puntuacion,
      id_grupo_evaluacion: grupoEvaluacionId,
    });
  };

  const guardarRespuestaComplemento = async (preguntaId, respuesta) => {
    const grupoEvaluacionId = 1; // Cambia esto según tu lógica de negocio
    return await axios.post('http://localhost:8000/api/respuestasComplemento', {
      id_pregunta_complemento: preguntaId,
      respuesta_complemento: respuesta,
      id_grupo_evaluacion: grupoEvaluacionId,
    });
  };

  const handleResponseChange = (id, value) => {
    setResponses(prevResponses => ({
      ...prevResponses,
      [id]: value,
    }));
  };

  return (
    <div className="evaluation-form">
      <h2 className="evaluation-title">Evaluación Primer Sprint</h2>

      {criterios.length > 0 && criterios.map(criterio => (
        <div key={criterio.id} className="criterio-section">
          <h2>{criterio.titulo_criterio}</h2>

          {/* Renderiza preguntas de opción múltiple */}
          {criterio.opcionMultiple && criterio.opcionMultiple.length > 0 && criterio.opcionMultiple.map(pregunta => (
            <div className="criteria-section" key={pregunta.id}>
              <h3 className="criteria-title">{pregunta.pregunta_opcion_multiple}</h3>
              <div className="question">
                <p>Seleccione una opción:</p>
                <div className="vertical-options">
                  {(pregunta.opciones || []).map((opcion, idx) => (
                    <label key={idx} style={{ display: 'block' }}>
                      <input
                        type="radio"
                        name={`opcion_${pregunta.id}`}
                        value={opcion.id}
                        onChange={() => handleResponseChange(pregunta.id, opcion.id)}
                      /> {opcion.opcion_pregunta}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Renderiza preguntas de puntuación */}
          {criterio.puntuacion && criterio.puntuacion.length > 0 && criterio.puntuacion.map(pregunta => (
            <div className="criteria-section" key={pregunta.id}>
              <h3 className="criteria-title">{pregunta.pregunta_puntuacion}</h3>
              <div className="question">
                <p>Califique del 1 al 5:</p>
                <div className="scale-options">
                  {[1, 2, 3, 4, 5].map(value => (
                    <label key={value}>
                      {value} <input
                        type="radio"
                        name={`puntuacion_${pregunta.id}`}
                        value={value}
                        onChange={() => handleResponseChange(pregunta.id, value)}
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Renderiza preguntas de complemento */}
          {criterio.complemento && criterio.complemento.length > 0 && criterio.complemento.map(pregunta => (
            <div className="criteria-section" key={pregunta.id}>
              <h3 className="criteria-title">{pregunta.pregunta_complemento}</h3>
              <div className="question">
                <input
                  type="text"
                  className="text-input"
                  placeholder="Respuesta..."
                  onChange={(e) => handleResponseChange(pregunta.id, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      ))}

      <div className="buttons">
        <button className="cancel-button" onClick={handleCancel}>Cancelar</button>
        <button className="submit-button" onClick={handleFinish}>Finalizar</button>
      </div>
    </div>
  );
};

export default EvaluationForm;