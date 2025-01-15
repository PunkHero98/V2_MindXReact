import { useState } from "react";
import { Button } from "antd";
import "./ChessBoard.css";

const initialBoard = [
  ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"], // Đen
  ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"], // Trắng
  ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
];

const App = () => {
  const [board, setBoard] = useState(initialBoard);
  const [selected, setSelected] = useState(null); // Quân cờ được chọn
  const [turn, setTurn] = useState("white"); // Lượt chơi: "white" hoặc "black"

  const handleCellClick = (row, col) => {
    // Nếu đã chọn quân cờ
    if (selected) {
      const [selectedRow, selectedCol] = selected;

      // Di chuyển quân cờ
      const updatedBoard = [...board];
      updatedBoard[row][col] = board[selectedRow][selectedCol];
      updatedBoard[selectedRow][selectedCol] = null;

      setBoard(updatedBoard);
      setSelected(null);
      setTurn(turn === "white" ? "black" : "white"); // Chuyển lượt
    } else {
      // Chọn quân cờ
      setSelected([row, col]);
    }
  };

  const handleClick = () =>{
    setSelected(null)
    setBoard(initialBoard);
  }
  return (
    <>
    <div className="app">
      <h1>Chess Game</h1>
      <p>Turn: {turn}</p>
      <div className="board">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`cell ${
                selected &&
                selected[0] === rowIndex &&
                selected[1] === colIndex
                  ? "selected"
                  : ""
              }`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell}
            </div>
          ))
        )}
      </div>
     <Button className="mt-10" onClick={handleClick}>New Game</Button>

    </div>
    </>
  );
};

export default App;
