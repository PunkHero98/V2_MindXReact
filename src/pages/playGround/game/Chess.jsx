import { useState } from "react";
import { Button } from "antd";
import ChessBoard from "../../../components/chessBoard/ChessBoard"
const Chess = () =>{
    const [start , setStart] = useState(false);
    
    return(
        <div className="w-full h-full overflow-x-auto overflow-y-auto">
            {!start ? 
            (
                <div className="w-full h-full flex justify-center items-center">
                    <Button variant="outlined" style={{width: 200 , height: 80}}
                    onClick={() => setStart(true)}
                    className="pacifico text-2xl" color="primary" >Start Game</Button>
                </div>
            ):(
                <ChessBoard />
            )
            }
        </div>
    )
}

export default Chess;