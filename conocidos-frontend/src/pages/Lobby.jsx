import { useNavigate, useParams } from "react-router-dom";
import PlayerCard from "../components/PlayerCard";
import { io } from "socket.io-client";
import { useTriviaStore } from "../store/store";
import { useEffect, useRef, useState } from "react";
import RoomSettings from "../components/RoomSettings";
import {deletePlayer, getRoom, updatePlayer} from '../services/api';

const SettingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
<path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>


const Lobby = () => {
  

  const socketRef = useRef()
  if (!socketRef.current) {
    socketRef.current = io('http://localhost:3000')
  }
  const socket = socketRef.current
  const { roomPlayers, setRoomPlayers, player, setPlayer, room, showSettings, setShowSettings } = useTriviaStore(state => state)
  const { roomCode } = useParams()
  const [maxPlayers, setMaxPlayers] = useState(null)
  const [copyMessage, setCopyMessage] = useState({ visible: false, x: 0, y: 0 })

  const navigate = useNavigate()
  
  const setup = async () => {
    await setPlayer({...player, isReady: false})
    const roomData = await getRoom(roomCode)
    const maxPlayers = room.maxPlayers
    console.log("max players: ", room)
    setMaxPlayers(maxPlayers)
  }

  useEffect(() => {
    setup()
    socket.on('connect', () => {
      console.log('connected')

      socket.on('playerHasJoined', (data) => {
        setRoomPlayers(data)
      })

      socket.on('playerHasLeft', (data) => {
        setRoomPlayers(data)
      })

      socket.on('allPlayersReady', async () => {
        console.log("all players are ready")
        navigate(`/questions/${roomCode}`)
        await handleNotReady()
      })

      socket.emit('playerJoins', roomCode)
      
    });

  return () => {
    socket.off('connect')
    socket.off('playerHasJoined')
    socket.off('playerHasLeft')
    socket.off('allPlayersReady')
  }

  }, [roomCode])

  useEffect(() => {
    console.log("Updated room players: ", roomPlayers)
  }, [roomPlayers])
  
  const handleLeave = async() =>{
     socket.emit("playerLeaves", {roomId: roomCode, playerId: player.id, nickname: player.nickname})
     navigate("/welcome")
  }

  const handleReady = async () =>{
    console.log('player is ready')
    await setPlayer({...player, isReady: true})
    socket.emit('playerIsReady', {roomId: roomCode, playerId:  player.id})
  }

  const handleNotReady = async () =>{
    console.log('player is not ready')
    await setPlayer({...player, isReady: false})
    socket.emit('playerNotReady', {roomId: roomCode, playerId:  player.id})
  }

  const handleCopyCode = (event) => {
    navigator.clipboard.writeText(roomCode);
    const { clientX, clientY } = event;
    setCopyMessage({ visible: true, x: clientX, y: clientY });
    setTimeout(() => setCopyMessage({ visible: false, x: 0, y: 0 }), 1500)
  }

  const handleSettings = () => {
    setShowSettings(true)
  }

  return (
    <div className="mosaic-avatar w-full h-screen flex flex-col gap-5 sm:gap-10 justify-center items-center p-2">
      <div className="w-full sm:w-sm">
        <div className="p-3 bg-white/90 rounded-md shadow-md relative">
          <h1 className="text-sm sm:text-base font-light text-center text-black/50">Código de sala</h1>
          <button onClick={(event)=>{handleCopyCode(event)}} className="text-2xl sm:text-4xl text-center block mx-auto cursor-pointer">{roomCode}</button>
          { player.isHost && 
            <button onClick={handleSettings} className="absolute top-3 right-3 text-black/50 cursor-pointer">
              <SettingIcon />
            </button>
          }
          
        </div>
        {/* <p className="mt-3 text-sm sm:text-lg text-center">jugadores en sala: {roomPlayers.length}/{maxPlayers}</p> */}
      </div>
      <div className={`max-w-xs sm:max-w-xl grid grid-cols-2 gap-2 sm:gap-4
        ${roomPlayers.length === 1
          ? 'sm:grid-cols-1'
          : roomPlayers.length === 2
            ? 'sm:grid-cols-2'
            : roomPlayers.length === 3
              ? 'sm:grid-cols-3'
              : 'sm:grid-cols-4'
        }
        `}>
        { roomPlayers.length > 0 && roomPlayers.map(player => <PlayerCard key={player.nickname} player={player} />)}
      </div>

      <div className="flex flex-col gap-2 ">
        <button onClick={()=>{
          if(player.isReady){
            handleNotReady()
          }else{
            handleReady()
          }
        }} className={`cursor-pointer border-2 border-amber-900 px-8 py-2 text-sm sm:text-lg text-white ${player.isReady ? "bg-emerald-500 active:bg-emerald-700 active:border-emerald-800" : "bg-red-500 active:bg-red-700 active:border-red-800"} rounded`}>
          Listo
        </button>
        <button onClick={handleLeave} className="border-2 bg-amber-50 border-red-500 px-8 py-2 text-red-500 text-sm sm:text-lg cursor-pointer  active:bg-red-700 active:border-red-800 rounded">
          Salir de sala
        </button>
      </div>
      
      {copyMessage.visible && (
        <div
          className="absolute bg-white text-black text-sm px-2 py-1 border rounded animate-fade"
          style={{
            top: copyMessage.y,
            left: copyMessage.x,
            transform: "translate(-50%, -150%)",
          }}
        >
          Copied!
        </div>
      )
      }

      {showSettings && <RoomSettings />}
    </div>
  );
};

export default Lobby;