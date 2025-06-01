import {useEffect, useState, useRef} from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { getPlayers, updatePlayer } from "../services/api";
import crownIcon from "../icons/crown-icon.svg"
import {io} from 'socket.io-client';
import { useTriviaStore } from '../store/store';

const Leaderboard = () => {
  const { roomId } = useParams()
  const { player , setPlayer } = useTriviaStore(state=> state)
  const [players, setPlayers] = useState([])

  const navigate = useNavigate()
  const socketRef = useRef()
  if (!socketRef.current) {
    socketRef.current = io('http://localhost:3000')
  }
  const socket = socketRef.current;
  useEffect(() => {
    const getRoomPlayers = async () => {
      const fetchedPlayers = await getPlayers(roomId)
      setPlayers(fetchedPlayers)
    }
    getRoomPlayers()
  }, [roomId])
  
  useEffect(() => {

    socket.on('connect', () => {
      console.log('question page connected')
      
      socket.on('play-again', async () => {
        await setPlayer({...player, score: 0, isReady: false})
        const resetPlayer = {...player, score: 0, isReady: false}
        await updatePlayer({playerId: player.id, player: resetPlayer})
        navigate(`/lobby/${roomId}`)
      });

      socket.on('gameFinished', async () => {
        navigate(`/welcome`)
      });

      socket.emit('playerJoins', roomId)
    });
    
    return () => {
      socket.off('allPlayersReady')
    };
  }, [])


  const sortedPlayers = [...players]?.sort((a, b) => b.score - a.score);

  const handleResetGame = () => {
    socket.emit('game-reset', roomId)
  }

  const handleFinishGame = () => {
    socket.emit('finishGame', roomId)
  }

  return (
    <div className="mosaic-end opac flex flex-col p-2 items-center justify-center min-h-screen bg-gradient-to-b from-amber-300 to-orange-500/70 text-white">
      <div className="w-full sm:w-lg px-5">
        <h1 className="text-center text-xl sm:text-4xl py-1 rounded-tl-xl rounded-tr-xl bg-amber-600">Final de partida</h1>
      </div>
      <div className=" w-full max-w-2xl bg-white text-black rounded-lg shadow-2xl p-6">
        <div className="w-full h-65 sm:h-70 overflow-y-auto pr-2
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-amber-100
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-amber-400
        dark:[&::-webkit-scrollbar-track]:bg-amber-700
        dark:[&::-webkit-scrollbar-thumb]:bg-amber-500"
        >
          {sortedPlayers.map((player, index) => {
            const rank =
              index > 0 && sortedPlayers[index].score === sortedPlayers[index - 1].score
                ? index
                : index + 1;

            const borderColor =
              rank === 1
                ? 'border-amber-400'
                : rank === 2
                ? 'border-slate-400'
                : rank === 3
                ? 'border-amber-700'
                : 'border-black';
            return (
              <div
                key={player.nickname}
                className={`flex flex-col items-center p-2 sm:p-0 sm:pr-3 sm:flex-row sm:items-center sm:justify-between mb-3.5 rounded-lg text-lg shadow-sm border-3 overflow-hidden ${borderColor}`}
              >
                <div className="flex flex-col sm:gap-2 sm:flex-row justify-center items-center text-center">
                  <div className="flex relative">
                    <picture className="w-19 h-19 relative rounded-full sm:rounded-none overflow-hidden">
                      <img
                        src={`/avatars/${player.avatar}.svg`}
                        alt={player.avatar}
                        className="w-full scale-108"
                      />
                    </picture>
                    {rank === 1 && (
                      <img
                        className="z-10 absolute top-0 left-6 w-7"
                        src={crownIcon}
                        alt="crown logo"
                      />
                    )}
                  </div>
                  <span className="text-sm sm:text-xl">{player.nickname}</span>
                </div>
                <span className="text-sm sm:text-lg">{player.score} ptos</span>
              </div>
            );
          })}
        </div>
        { player.isHost && 
          <div className="mt-3 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
            <button onClick={handleResetGame} className="border-2 border-amber-900 px-8 py-2 text-sm sm:text-lg text-white bg-amber-600/80 active:bg-lime-500 active:border-lime-800 rounded">
              Volver a jugar
            </button>
            <button onClick={handleFinishGame} className="border-2 border-amber-900 px-8 py-2 text-sm sm:text-lg text-white bg-amber-600/80 active:bg-lime-500 active:border-lime-800 rounded">
              Terminar
            </button>
          </div>
        }
        
      </div>
      
    </div>
  );
};

export default Leaderboard;