import React, {useState, useEffect} from "react";
import './../../styles/board.css';
import Barco from "../../Ship";




export function Boarduno({ selectedShip, onSelectBlock, placedShips, isPlayerTurn, shipOrientation, playerBoard,setPlayerTurn, updatePlayerBoard   }) {
    const width = 10;
    const totalBlocks = width * width;
    const [board, setBoard] = useState(Array(totalBlocks).fill(null));
    const [allShipsPlaced, setAllShipsPlaced] = useState(false); 
    

    useEffect(() => {
      setBoard(playerBoard);
  }, [playerBoard]);
  
    useEffect(() => {
      if (!isPlayerTurn && allShipsPlaced) {
        setTimeout(() => {
          let randomIndex;
          do {
            randomIndex = Math.floor(Math.random() * totalBlocks);
          } while (board[randomIndex] === 'hit' || board[randomIndex] === 'miss');
    
          let newBoard = [...board];
          if (newBoard[randomIndex] !== null) {
            newBoard[randomIndex] = 'hit';
          } else {
            newBoard[randomIndex] = 'miss';
          }
          setBoard(newBoard);
          setPlayerTurn(true);
        }, 1000);
      }
    }, [isPlayerTurn, allShipsPlaced]);
    

    const handleBlockClick = (position) => {
        if (selectedShip && !placedShips.includes(selectedShip.name)) {
            const newBoard = [...board];

            const y = Math.floor(position / width);
            const x = position % width;

            if ((shipOrientation && x + selectedShip.length <= width) || (!shipOrientation && y + selectedShip.length <= width)) {
                for (let i = 0; i < selectedShip.length; i++) {
                    const newIndex = shipOrientation ? y * width + x + i : (y + i) * width + x;
                    newBoard[newIndex] = selectedShip.name;
                }
                updatePlayerBoard(newBoard);
                onSelectBlock(position); 
            }
        }
    };

    
   

    const blocks = board.map((block, index) => (
      <div
        key={index}
        className={`block ${block && block !== 'hit' && block !== 'miss' ? "taken" : ""} ${block === 'hit' ? 'hit' : ''} ${block === 'miss' ? 'miss' : ''}`}
        onClick={() => handleBlockClick(index)}
      ></div>
    ));

    return (
      <div className="game-board-uno jugador">
               {blocks}
      </div>
    );
}

export function Boarddos({ isPlayerTurn, enemyBoard, updateEnemyBoard, allShipsPlaced ,setPlayerTurn, playerHits, setPlayerHits }) {
    const width = 10;
    const totalBlocks = width * width;
  
    const destroyer = new Barco("destroyer", 2);
    const submarine = new Barco("submarine", 3);
    const cruiser = new Barco("cruiser", 3);
    const battleship = new Barco("battleship", 4);
    const carrier = new Barco("carrier", 5);
  
    const barcos = [destroyer, submarine, cruiser, battleship, carrier];
  
    const [shipsBoard, setShipsBoard] = useState(Array.from({ length: totalBlocks }, () => null));
    
    
    
    
    useEffect(() => {
        if (!shipsBoard.some(block => block !== null)) {
          const newShipsBoard = [...shipsBoard];
          barcos.forEach((barco) => {
            let isHorizontal = Math.random() < 0.5;
            let shipPlaced = false;
            while (!shipPlaced) {
              let randomStartIndex = Math.floor(Math.random() * totalBlocks);
              if (isValidStartPosition(randomStartIndex, barco.length, isHorizontal, width, newShipsBoard)) {
                for (let i = 0; i < barco.length; i++) {
                  if (isHorizontal) {
                    newShipsBoard[randomStartIndex + i] = 'taken';
                  } else {
                    newShipsBoard[randomStartIndex + i * width] = 'taken';
                  }
                }
                shipPlaced = true;
              }
            }
          });
          setShipsBoard(newShipsBoard);
        }
      }, []);
      
      function isValidStartPosition(startIndex, shipLength, isHorizontal, width, board) {
        if (isHorizontal) {
          for (let i = 0; i < shipLength; i++) {
            if (startIndex % width + i >= width || board[startIndex + i]) {
              return false;
            }
          }
        } else {
          for (let i = 0; i < shipLength; i++) {
            if (startIndex + i * width >= totalBlocks || board[startIndex + i * width]) {
              return false;
            }
          }
        }
        return true;
      }

   
      
      const handleBlockClick = (position) => {
        if (!allShipsPlaced) {
          alert("Primero debes colocar todos tus barcos.");
          return;
        }
        if (isPlayerTurn && enemyBoard[position] === null) {
          const isHit = shipsBoard[position] === 'taken';
          const newEnemyBoard = [...enemyBoard];
          newEnemyBoard[position] = isHit ? 'hit' : 'miss';
          updateEnemyBoard(newEnemyBoard);
          setPlayerTurn(); 
          if (isHit) {
            setPlayerHits(playerHits + 1);  
          }
        }
      };
      


        const blocks = shipsBoard.map((block, index) => {
        const isTaken = block === 'taken';
        const isHit = enemyBoard[index] === 'hit';
        const isMiss = enemyBoard[index] === 'miss';
    
        return (
          <div
            key={index}
            id={`block-${index}`}
            className={`block ${isTaken ? 'taken' : ''} ${isHit ? 'hit' : ''} ${isMiss ? 'miss' : ''}`}
            onClick={() => handleBlockClick(index)}
          ></div>
        );
      });
    
           
          
      const isPositionOccupied = (position) => {
        return enemyBoard[position] === 'taken';
      };

    return (
      <div id="computer" className="game-board-dos cpu " >
        {blocks}
      </div>
    );
  }
