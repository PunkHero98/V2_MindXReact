import { useState, useRef } from "react";
import { FaReact } from "react-icons/fa"; // Import icon React
import Xmark from "../../assets/image/Xmark.png";
import "./TicTacToeBoard.css";

const TicTacToeBoard = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Vị trí hiện tại
  const isDragging = useRef(false); // Trạng thái kéo
  const startDragPos = useRef({ x: 0, y: 0 }); // Vị trí chuột khi bắt đầu kéo
  const wasDragging = useRef(false); // Trạng thái gần đây có phải kéo chuột không

  const [board, setBoard] = useState(
    Array(20)
      .fill(null)
      .map(() => Array(20).fill(null))
  );
  const [currentUserSymbol, setCurrentUserSymbol] = useState("X");

  const handleMouseDown = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt
    isDragging.current = true; // Bắt đầu kéo
    wasDragging.current = false;
    startDragPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    const newX = e.clientX - startDragPos.current.x;
    const newY = e.clientY - startDragPos.current.y;

    setPosition({ x: newX, y: newY });
    wasDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false; // Dừng kéo
  };

  const handleMouseLeave = () => {
    isDragging.current = false; // Dừng kéo khi chuột rời khỏi khu vực
  };

  const handleClick = (row, col) => {
    if (wasDragging.current) {
      return; // Nếu đang kéo, không xử lý click
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
    setCurrentUserSymbol(currentUserSymbol === "X" ? "O" : "X");
  };

  return (
    <div
      className="w-full h-full relative overflow-hidden bg-gray-200 scroll-container"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Vùng lớn hơn để kéo thả */}
      <div
        className="absolute bg-white"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Nội dung */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(20, 1fr)`,
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
                  border: "1px solid #000",
                }}
                className="cell"
              >
                {cell === "X" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="icon react-icon"
                  >
                    <path d="M24 3.752l-4.423-3.752-7.771 9.039-7.647-9.008-4.159 4.278c2.285 2.885 5.284 5.903 8.362 8.708l-8.165 9.447 1.343 1.487c1.978-1.335 5.981-4.373 10.205-7.958 4.304 3.67 8.306 6.663 10.229 8.006l1.449-1.278-8.254-9.724c3.287-2.973 6.584-6.354 8.831-9.245z" />
                  </svg>
                )}
                {cell === "O" && <FaReact className="icon o-icon" />}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TicTacToeBoard;
