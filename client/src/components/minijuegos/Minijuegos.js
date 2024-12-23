// src/components/Minijuegos.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/minijuegos/Minijuegos.css'; 

function Minijuegos() {
  return (
    <div className="minijuegos-container">
      <h1>Minijuegos</h1>
      <p>¡Elige un minijuego para jugar!</p>
      <div className="minijuegos-list">
        <Link to="/minijuegos/guess-the-player" className="minijuego-item">
          <h2>Guess The Player</h2>
          <p>Adivina el futbolista con pistas visuales.</p>
        </Link>
        <Link to="/minijuegos/tiro-libre" className="minijuego-item">
          <h2>Tiro Libre</h2>
          <p>Demuestra tu habilidad con los tiros libres.</p>
        </Link>
        <Link to="/minijuegos/bingo" className="minijuego-item">
          <h2>Bingo de Futbolistas</h2>
          <p>¡Rellena las casillas con futbolistas conocidos!</p>
        </Link>
        <Link to="/minijuegos/WordleDiario" className="minijuego-item">
          <h2>Wordle Diario</h2>
          <p>¡Adivina la palabra diaria con pequeñas pistas!</p>
        </Link>
      </div>
    </div>
  );
}
//segunda prueba
export default Minijuegos;



