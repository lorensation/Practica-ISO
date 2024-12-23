import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FavoritosContext } from '../../context/FavoritosContext';
import '../../styles/user/BuscadorFavoritos.css';

function AnadirCompeticionFavorita() {
  const { addCompeticionFavorita } = useContext(FavoritosContext);
  const [nombre, setNombre] = useState('');
  const [pais, setPais] = useState('');
  const [competiciones, setCompeticiones] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCompeticionClick = (competicion) => {
    addCompeticionFavorita(competicion.league.name);
    navigate('/perfil');
  };

  const paises = {
    "España": "spain",
    "Inglaterra": "england",
    "Italia": "italy",
    "Francia": "france",
    "Alemania": "germany",
    "Holanda": "netherlands",
    "Turquía": "turkey"
  };

  const handleBuscar = async () => {
    setLoading(true);
    let url = 'https://v3.football.api-sports.io/leagues?';
    if (nombre) url += `name=${nombre}`;
    if (pais) url += `&country=${paises[pais]}`;

    try {
      const myHeaders = new Headers();
      myHeaders.append("x-rapidapi-key", "00cb0f459f2d3b04f9dcc00ad403423d");
      myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

      const response = await fetch(url, { method: 'GET', headers: myHeaders });
      const data = await response.json();
      setCompeticiones(data.response);
    } catch (error) {
      console.error('Error al buscar competiciones:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buscador-favoritos-container">
      <h1>Añadir Competición Favorita</h1>
      <label>Nombre:
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </label>
      <label>País:
        <select value={pais} onChange={(e) => setPais(e.target.value)}>
          <option value="">Nada</option>
          {Object.keys(paises).map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </label>
      <button onClick={handleBuscar}>Buscar</button>
      {loading && <p>Cargando...</p>}
      <ul>
        {competiciones.map((competicion) => (
          <li key={competicion.league.id} onClick={() => handleCompeticionClick(competicion)}>
            <img src={competicion.league.logo} alt={competicion.league.name} width="50" /> {competicion.league.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AnadirCompeticionFavorita;
