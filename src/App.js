import './App.css';
import React, { useState, useEffect } from 'react';
import { Boarduno, Boarddos } from './js/componentes/Board';
import Barco from './Ship';

function App() {
  const destroyer = new Barco('destroyer', 2);
  const submarine = new Barco('submarine', 3);
  const cruiser = new Barco('cruiser', 3);
  const battleship = new Barco('battleship', 4);
  const carrier = new Barco('carrier', 5);

  const barcos = [destroyer, submarine, cruiser, battleship, carrier];
  const totalBlocks = 10 * 10;
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedShip, setSelectedShip] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [placedShips, setPlacedShips] = useState([]);
  const [shipOrientation, setShipOrientation] = useState(true);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [enemyBoard, setEnemyBoard] = useState(Array.from({ length: totalBlocks }, () => null));
  const [playerBoard, setPlayerBoard] = useState(Array.from({ length: totalBlocks }, () => null));
  const [allShipsPlaced, setAllShipsPlaced] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerHits, setPlayerHits] = useState(0);
  const [cpuHits, setCpuHits] = useState(0);
   
  const updatePlayerBoard = (newBoard) => {
    setPlayerBoard(newBoard);
  };


  useEffect(() => {        
    const areAllShipsPlaced = barcos.every((barco) => placedShips.includes(barco.name));
    setAllShipsPlaced(areAllShipsPlaced);
  }, [placedShips]);

  useEffect(() => {
    if (allShipsPlaced && !gameStarted) {
      alert("¡El juego ha comenzado!");
      setGameStarted(true);
    }
  }, [allShipsPlaced, gameStarted]);



 
  
  useEffect(() => {
    if (!playerTurn && gameStarted) {
      setTimeout(() => {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * totalBlocks);
        } while (playerBoard[randomIndex] === 'hit' || playerBoard[randomIndex] === 'miss');
        let newPlayerBoard = [...playerBoard];
        console.log("Valor de bloque en índice aleatorio:", newPlayerBoard[randomIndex]);  // Depuración
        if (newPlayerBoard[randomIndex] !== null) {
          newPlayerBoard[randomIndex] = 'hit';
          setCpuHits(cpuHits + 1); 
        } else {
          newPlayerBoard[randomIndex] = 'miss';
        }
        
        setPlayerBoard(newPlayerBoard);
        setPlayerTurn(true);
      }, 1000);
    }
  }, [playerTurn, gameStarted]);

  useEffect(() => {
    const totalBlocksToHit = 2 + 3 + 3 + 4 + 5;  
  
    if (playerHits === totalBlocksToHit) {
      alert("Jugador gana!");
      window.location.reload(); 
    } else if (cpuHits === totalBlocksToHit) {
      alert("La CPU gana!");
      window.location.reload(); 
    }
  }, [playerHits, cpuHits]);
  

  const handlePlayerTurnChange = () => {
    if (gameStarted) {  
      setPlayerTurn(!playerTurn);
    }
  };
  

  const updateEnemyBoard = (newBoard) => {
    setEnemyBoard(newBoard);
  };

 const handleShipSelect = (barco) => {
    if (!placedShips.includes(barco.name)) {
      setSelectedShip(barco);
    }
  };

  const handleFlipClick = () => {
    setIsFlipped(!isFlipped);
    setShipOrientation(!shipOrientation);
  };

  const handleBlockSelect = (position) => {
    setSelectedPosition(position);
    setPlacedShips([...placedShips, selectedShip.name]);
  };

  return (
    <div>
      <div>
        <h1>Batalla Naval</h1>
      </div>
      <div className="game-info">
        <p>Para empezar el juego primero selecciona un barco haciendo click y posicionalos en el tablero izquierdo, cuando esten todos posicionados empieza el juego.
    
          <span className="turn-display"></span></p>
        
        <div className='boards-container'>
        <Boarduno
           selectedShip={selectedShip}
           onSelectBlock={handleBlockSelect}
           placedShips={placedShips}
           isFlipped={isFlipped}
           shipOrientation={shipOrientation}
           barcos={barcos} 
           gameStarted={gameStarted}
           playerBoard={playerBoard}
           updatePlayerBoard={updatePlayerBoard}
          />
        <Boarddos
           isPlayerTurn={playerTurn}
           enemyBoard={enemyBoard}
           updateEnemyBoard={updateEnemyBoard}
           setPlayerTurn={handlePlayerTurnChange}
           allShipsPlaced={allShipsPlaced}
           setPlayerHits={setPlayerHits}
           playerHits={playerHits} 
           
        />

        </div>
      </div>
      <div className="gameboard-container"></div>
      <div className={`option-container ${isFlipped ? 'flipped' : ''}`}>
        {barcos.map((barco) => (
          <div
            key={barco.name}
            className={`${barco.name}-preview ${barco.name} ${isFlipped ? 'rotated' : ''}`}
            onClick={() => handleShipSelect(barco)}
          ></div>
        ))}
      </div>
      <button className="flip-button" onClick={handleFlipClick}>GIRAR</button>
      
    </div>
  );
}

export default App;
