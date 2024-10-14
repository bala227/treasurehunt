import React, { useState, useEffect } from 'react';
import GridCell from './GridCell';
import './App.css'; // Import CSS for styling

const GRID_SIZE = 5;
const TREASURE_POS = [4, 4];
const OBSTACLES = [
  [0, 1], [1, 1], [1, 2], [1, 3], [2, 1], 
  [2, 4], [3, 2], [3, 3]
]; // New obstacle setup

const App = () => {
  const [agentPos, setAgentPos] = useState([0, 0]);
  const [totalReward, setTotalReward] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const isObstacle = ([x, y]) =>
    OBSTACLES.some(([ox, oy]) => ox === x && oy === y);

  const getReward = (pos) => {
    if (JSON.stringify(pos) === JSON.stringify(TREASURE_POS)) return 10;
    if (isObstacle(pos)) return -5;
    return -1;
  };

  const handleKeyDown = (e) => {
    if (gameOver) return; // Stop movement if game is over

    let [x, y] = agentPos;
    if (e.key === 'ArrowUp') x = Math.max(0, x - 1);
    if (e.key === 'ArrowDown') x = Math.min(GRID_SIZE - 1, x + 1);
    if (e.key === 'ArrowLeft') y = Math.max(0, y - 1);
    if (e.key === 'ArrowRight') y = Math.min(GRID_SIZE - 1, y + 1);

    const newPos = [x, y];
    setAgentPos(newPos);

    const reward = getReward(newPos);
    setTotalReward((prevReward) => prevReward + reward);

    if (JSON.stringify(newPos) === JSON.stringify(TREASURE_POS)) {
      setGameOver(true); // End the game when treasure is found
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [agentPos, gameOver]);

  const resetGame = () => {
    setAgentPos([0, 0]);
    setTotalReward(0);
    setGameOver(false);
  };

  return (
    <div className="container">
      <h1>Treasure Hunt Game</h1>
      <p>Use the arrow keys to move the agent (green) to the treasure (gold)!</p>
      <p>Avoid obstacles (red) and collect rewards!</p>
      <p><strong>Total Reward:</strong> {totalReward}</p>
      {gameOver && (
        <div className="game-over">
          <h2>🎉 Game Over! You found the treasure! 🎉</h2>
          <button onClick={resetGame}>Restart</button>
        </div>
      )}
      <div className="grid">
        {Array.from({ length: GRID_SIZE }).map((_, i) =>
          Array.from({ length: GRID_SIZE }).map((_, j) => (
            <GridCell
              key={`${i}-${j}`}
              type={
                JSON.stringify([i, j]) === JSON.stringify(TREASURE_POS)
                  ? 'treasure'
                  : isObstacle([i, j])
                  ? 'obstacle'
                  : 'empty'
              }
              isAgent={agentPos[0] === i && agentPos[1] === j}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default App;
