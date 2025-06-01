import { useNavigate } from "react-router-dom";
import { useTriviaStore } from "../store/store";
import { createRoom} from "../services/api";
import { useEffect } from "react";
import BackButton from "../components/BackButton";

const CreateRoom = () => {
  const { setRoom, player, setPlayer } = useTriviaStore(state => state)
  const navigate = useNavigate()

  useEffect(() => {
    setPlayer({...player, roomId: generateCode()})
  }, [])
  

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleSubmit = async (event) => {
    event.preventDefault()
    const roomCode = generateCode()
    
    const maxPlayers = Number(event.target.maxPlayers.value)
    const maxQuestions = Number(event.target.maxQuestions.value)
    const newPlayer = {
      ...player,
      isHost: true
    }
    console.log(newPlayer)
    await setRoom({
      code: roomCode,
      isReady: false,
      maxPlayers: maxPlayers,
      maxQuestions: maxQuestions
    })
    const playerId = await createRoom({
      code: roomCode,
      isReady: false,
      player : newPlayer,
      maxPlayers: maxPlayers,
      maxQuestions: maxQuestions,
    })
    console.log("Id del player: ", playerId)
    await setPlayer({...player, id: playerId.id, roomId: roomCode, isHost: true})
    navigate(`/lobby/${roomCode}`)

  }

  return (
    <div className="mosaic-question flex flex-col items-center justify-center gap-4 p-5 w-full h-screen">
      <h1 className="text-center text-xl sm:text-3xl">Configuración de sala</h1>
      <form className="w-full max-w-sm flex flex-col gap-4" onSubmit={(event) => {handleSubmit(event)}}>
        <div className="flex flex-col gap-2">
          <label className="text-sm sm:text-lg" htmlFor="maxPlayers">Número máximo de jugadores</label>
          <input min={2} max={5} className="p-1 bg-white rounded w-full outline-0 focus:outline-2 focus:outline-amber-900 text-center text-lg font-bold" id="maxPlayers" type="number" required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm sm:text-lg" htmlFor="maxQuestions">Número máximo de preguntas por jugador</label>
          <input min={1} max={4} className="p-1 bg-white rounded w-full outline-0 focus:outline-2 focus:outline-amber-900 text-center text-lg font-bold" id="maxQuestions" type="number" required />
        </div>
        <button className="border-2 border-amber-900 px-8 py-2 text-md sm:text-lg text-white bg-amber-600/80 active:bg-lime-500 active:border-lime-800 rounded">Crear sala</button>
      </form>
      <BackButton route={'welcome'} />
    </div>
  );
};

export default CreateRoom;