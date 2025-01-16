import { useState } from "react";
import { Button } from "antd";
import TicTacToeBoard from "../../../components/tictactoeBoard/TicTacToeBoard";
const Caro = () => {
  const [start, setStart] = useState(false);

  return (
    <div className="w-full h-full overflow-x-auto overflow-y-auto">
      {!start ? (
        <div className="w-full h-full flex justify-center items-center">
          <Button
            variant="outlined"
            style={{ width: 200, height: 80 }}
            onClick={() => setStart(true)}
            className="pacifico text-2xl"
            color="primary"
          >
            Start Game
          </Button>
        </div>
      ) : (
        <TicTacToeBoard />
      )}
    </div>
  );
};

export default Caro;
