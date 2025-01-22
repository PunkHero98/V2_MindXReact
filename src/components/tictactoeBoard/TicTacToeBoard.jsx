import { useState, useRef, useEffect } from "react";
import "./TicTacToeBoard.css";
import oIcon from "../../assets/image/o-3.svg";
import xIcon from "../../assets/icons/tictactoeX.svg";
import { throttle } from "lodash";

const TicTacToeBoard = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const startDragPos = useRef({ x: 0, y: 0 });
  const wasDragging = useRef(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [board, setBoard] = useState(
    Array(100)
      .fill(null)
      .map(() => Array(100).fill(null))
  );
  const [currentUserSymbol, setCurrentUserSymbol] = useState("X");

  const handleMouseDown = (e) => {
    e.preventDefault();
    isDragging.current = true;
    wasDragging.current = false;
    startDragPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = throttle((e) => {
    if (!isDragging.current) return;

    const newX = e.clientX - startDragPos.current.x;
    const newY = e.clientY - startDragPos.current.y;

    requestAnimationFrame(() => {
      setPosition({ x: newX, y: newY });
    });
    wasDragging.current = true;
  }, 16);

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleClick = (row, col) => {
    if (gameOver) {
      return;
    }
    if (wasDragging.current) {
      return;
    }

    if (board[row][col] !== null) {
      return;
    }

    const updateBoard = board.map((r, rowIndex) =>
      r.map((cell, colIndex) =>
        rowIndex === row && colIndex === col ? currentUserSymbol : cell
      )
    );
    setBoard(updateBoard);
    setTimeLeft(60);

    if (checkWin(updateBoard, row, col, currentUserSymbol)) {
      alert(`${currentUserSymbol} wins!`);
      setGameOver(true);
      return;
    }
    setCurrentUserSymbol(currentUserSymbol === "X" ? "O" : "X");
  };

  const checkWin = (board, row, col, symbol) => {
    const directions = [
      { dr: 0, dc: 1 },
      { dr: 1, dc: 0 },
      { dr: 1, dc: 1 },
      { dr: 1, dc: -1 },
    ];

    const boardSize = board.length;

    const inBounds = (r, c) =>
      r >= 0 && c >= 0 && r < boardSize && c < boardSize;

    for (const { dr, dc } of directions) {
      let count = 1;
      for (let step = 1; step < 5; step++) {
        const newRow = row + dr * step;
        const newCol = col + dc * step;

        if (inBounds(newRow, newCol) && board[newRow][newCol] === symbol) {
          count++;
        } else {
          break;
        }
      }

      for (let step = 1; step < 5; step++) {
        const newRow = row - dr * step;
        const newCol = col - dc * step;

        if (inBounds(newRow, newCol) && board[newRow][newCol] === symbol) {
          count++;
        } else {
          break;
        }
      }

      if (count >= 5) {
        return true;
      }
    }

    return false;
  };

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };
  return (
    <div
      className="w-full h-full relative overflow-hidden scroll-container-caro bg-gray-200"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="absolute bg-white"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        onMouseDown={handleMouseDown}
      >
        <div
          style={{
            zIndex: 100,
            display: "grid",
            gridTemplateColumns: `repeat(100, 1fr)`,
            gap: 1.5,
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleClick(rowIndex, colIndex)}
                style={{
                  height: "50px",
                  width: "50px",
                  border: "1px solid #fff",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className="bg-blue-50 cellss"
              >
                {cell === "X" && (
                  <img src={xIcon} className="icon react-icon" alt="" />
                )}
                {cell === "O" && (
                  <img className="w-9 h-9 icon o-icon" src={oIcon} alt="" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <div className="w-full absolute bottom-0  h-10 bg-blue-600 ">
        <div className="flex gap-5 justify-center items-center mt-1 text-white">
          <div>
            <span className="pacifico mr-5 text-xl">Player Turn:</span>
            {currentUserSymbol}
          </div>
        </div>
      </div>
      <div className="absolute py-2 right-0 roboto-slab-base bg-blue-600 h-24 w-32 flex flex-col justify-around items-center text-white text-xl">
        <h1 className="pacifico text-2xl">Timer</h1>
        <h2>{formatTime(timeLeft)}</h2>
      </div>
    </div>
  );
};

export default TicTacToeBoard;
