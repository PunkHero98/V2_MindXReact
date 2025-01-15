import { useState } from "react";

const TicTacToeBoard = () => {
  const [boardSize, setBoardSize] = useState(10); // Kích thước bàn cờ (3x3 mặc định)
  const [board, setBoard] = useState(
    Array(boardSize)
      .fill(null)
      .map(() => Array(boardSize).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState("X");

  // Xử lý click vào ô
  const handleCellClick = (row, col) => {
    if (board[row][col] !== null) return; // Không cho phép ghi đè
    const updatedBoard = board.map((r, rowIndex) =>
      r.map((cell, colIndex) =>
        rowIndex === row && colIndex === col ? currentPlayer : cell
      )
    );
    setBoard(updatedBoard);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X"); // Chuyển lượt
  };

  // Cập nhật kích thước bàn cờ
  const handleSizeChange = (size) => {
    setBoardSize(size);
    setBoard(
      Array(size)
        .fill(null)
        .map(() => Array(size).fill(null))
    );
  };

  return (
    <div className="flex flex-col items-center gap-4 ">
      <h1 className="text-xl font-bold">Tic Tac Toe</h1>
      {/* Thay đổi kích thước bàn cờ */}
      <div className="mb-4">
        <label className="mr-2">Board Size:</label>
        <input
          type="number"
          min={3}
          value={boardSize}
          onChange={(e) => handleSizeChange(Number(e.target.value))}
          className="border border-gray-400 p-1 rounded"
        />
      </div>
      {/* Hiển thị bàn cờ */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
          gap: "1px",
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              className="w-12 h-12 border border-gray-800 flex items-center justify-center text-xl cursor-pointer hover:bg-gray-200"
            >
              {cell}
            </div>
          ))
        )}
      </div>
      {/* Hiển thị người chơi hiện tại */}
      <div className="mt-4">
        <p>
          Current Player: <span className="font-bold">{currentPlayer}</span>
        </p>
      </div>
    </div>
  );
};

export default TicTacToeBoard;
