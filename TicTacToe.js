import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const rowStyle = {
  display: 'flex'
}

const squareStyle = {
  'width': '60px',
  'height': '60px',
  'backgroundColor': '#ddd',
  'margin': '4px',
  'display': 'flex',
  'justifyContent': 'center',
  'alignItems': 'center',
  'fontSize': '20px',
  'color': 'white'
}

const boardStyle = {
  'backgroundColor': '#eee',
  'width': '208px',
  'alignItems': 'center',
  'justifyContent': 'center',
  'display': 'flex',
  'flexDirection': 'column',
  'border': '3px #eee solid'
}

const containerStyle = {
  'display': 'flex',
  'alignItems': 'center',
  'flexDirection': 'column'
}

const instructionsStyle = {
  'marginTop': '5px',
  'marginBottom': '5px',
  'fontWeight': 'bold',
  'fontSize': '16px',
}

const buttonStyle = {
  'marginTop': '15px',
  'marginBottom': '16px',
  'width': '80px',
  'height': '40px',
  'backgroundColor': '#8acaca',
  'color': 'white',
  'fontSize': '16px',
}
const players = ['X', 'O'];
const boardCapacities = [0, 1, 2];
const boardMax = boardCapacities[boardCapacities.length - 1];

const validateHorizontal = ({ row, values, activePlayer }) =>
  boardCapacities.every((col) => values?.[row]?.[col] === activePlayer);
const validateVertical = ({ col, values, activePlayer }) =>
  boardCapacities.every((row) => values?.[row]?.[col] === activePlayer);

const validatDiagonal = ({ values, activePlayer }) => {
  return (boardCapacities.every((row) => values?.[row]?.[row] === activePlayer) ||
    boardCapacities.every((row) => values?.[boardMax - row]?.[row] === activePlayer))
};
/** Note: validating the board based on latest cell update  */
const validateWin = ({ row, col, values }) => {
  const activePlayer = values[row][col];
  if (validateHorizontal({ row, values, activePlayer })) {
    return activePlayer;
  }
  if (validateVertical({ col, values, activePlayer })) {
    return activePlayer;
  }
  if (validatDiagonal({ values, activePlayer })) {
    return activePlayer;
  }

  return;
}

function Square({ player, onClick }) {
  return (
    <div
      className="square"
      style={squareStyle} onClick={onClick}>
      {player}
    </div>
  );
}
function Board() {
  const [player, setPlayer] = useState(players[0]),
    [winner, setWinner] = useState(),
    [val, setVal] = useState({});
  const handleAction = ({ row, col, player: p }) => {
    /** Note: Selected Square should be Null and Winner should be None to this action */
    if (!winner && !val?.[row]?.[col]) {
      setVal((prevVal) => ({
        ...prevVal,
        [row]: {
          ...prevVal[row],
          [col]: p
        },
        row, col
      }));
      setPlayer(player === players[0] ? players[1] : players[0]);
    }
  };
  const handleReset = () => {
    setWinner();
    setVal({});
  }
  useEffect(() => {
    const { row, col, ...values } = val || {};
    if (values?.[row]?.[col]) {
      const winBy = validateWin({ row, col, values });
      if (winBy) {
        setWinner(winBy);
      }
    }
  }, [val]);

  return (
    <div style={containerStyle} className="gameBoard">
      <div id="statusArea" className="status" style={instructionsStyle}>Next player: <span>{player}</span></div>
      <div id="winnerArea" className="winner" style={instructionsStyle}>Winner: <span>{winner || 'None'}</span></div>
      <button style={buttonStyle} onClick={handleReset}>Reset</button>
      <div style={boardStyle}>
        {boardCapacities.map((row, r) =>
          <div className="board-row" key={r} style={rowStyle}>
            {boardCapacities.map((col, c) =>
              <Square
                key={c}
                player={val?.[row]?.[col]}
                onClick={() => handleAction({ row, col, player })} />)}
          </div>)}
      </div>
    </div>
  );
}

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Game />);
