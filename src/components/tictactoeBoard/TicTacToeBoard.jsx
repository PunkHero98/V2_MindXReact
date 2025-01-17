import { useState, useRef, useEffect } from "react";
import "./TicTacToeBoard.css";
import oIcon from "../../assets/image/o-3.svg";
import xIcon from "../../assets/icons/tictactoeX.svg";
import { throttle } from "lodash";

const TicTacToeBoard = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Vị trí hiện tại
  const isDragging = useRef(false); // Trạng thái kéo
  const startDragPos = useRef({ x: 0, y: 0 }); // Vị trí chuột khi bắt đầu kéo
  const wasDragging = useRef(false); // Trạng thái gần đây có phải kéo chuột không
  const [timeLeft, setTimeLeft] = useState(0); // 60 giây
  const [board, setBoard] = useState(
    Array(100)
      .fill(null)
      .map(() => Array(100).fill(null))
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
    setTimeLeft(60);

    setBoard(updateBoard);
    setCurrentUserSymbol(currentUserSymbol === "X" ? "O" : "X");
  };

  useEffect(() => {
    if (timeLeft <= 0) return; // Dừng nếu hết giờ

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId); // Xóa bộ đếm khi component bị unmount
  }, [timeLeft]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };
  const checkWinner = () => {};
  return (
    <div
      className="w-full h-full relative overflow-hidden scroll-container-caro bg-gray-200"
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
      <div className="w-full absolute bottom-0 bg-white h-10 bg-blue-400 ">
        <div className="flex gap-5 justify-center items-center mt-1 text-white">
          <div>
            <span className="pacifico mr-5 text-xl">Player Turn:</span>
            {currentUserSymbol}
          </div>
        </div>
      </div>
      <div className="absolute py-2 right-0 roboto-slab-base bg-blue-400 h-24 w-32 flex flex-col justify-around items-center text-white text-xl">
        <h1 className="pacifico text-2xl">Timer</h1>
        <h2>{formatTime(timeLeft)}</h2>
      </div>
    </div>
  );
};

export default TicTacToeBoard;
