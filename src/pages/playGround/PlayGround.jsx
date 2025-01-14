import { useNavigate } from "react-router-dom";
const PlayGround = () =>{
    const navigate = useNavigate();
    return(
        <>
            <h1>Play ground page</h1>
            <button onClick={()=> navigate('caro')} >Caro</button>
            <button onClick={() => navigate('chess')}>Chess</button>
        </>
    )
}

export default PlayGround;