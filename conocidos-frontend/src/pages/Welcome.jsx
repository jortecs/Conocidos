import { useNavigate } from "react-router-dom";
import { useTriviaStore } from "../store/store";
import BackButton from "../components/BackButton";
import { useEffect, useState } from "react";

const Welcome = () => {
  const { player, setPlayer } = useTriviaStore(state => state)
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const navigate = useNavigate()

  useEffect(() => {
    setPlayer({...player, score:0, isHost: false})
  }, [])
  

  const handleClick = (route) => {
    navigate(`/${route}`)
  }

  const handleAvatarClick = () => {
    setIsPopupOpen(true); // Open the popup
  };

  const handleAvatarSelect = (avatar) => {
    setPlayer({ ...player, avatar }); // Update the player's avatar
    setIsPopupOpen(false); // Close the popup
  };

  const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
  </svg>


  return (
    <div className="mosaic-avatar2 flex flex-col items-center justify-center w-full h-screen p-2 sm:p-5 gap-6 sm:gap-6" >
      <div className="flex flex-col w-full text-center text-amber-950 items-center justify-center">
        <h1 className="text-lg sm:text-xl ">Bienvenido, </h1>
        <h2 className="text-3xl sm:text-4xl font-medium">{player.nickname}!</h2>

        <div className="w-3xs flex relative justify-center mt-3 sm:mt-6">
          <picture className="w-20 h-20 sm:w-30 sm:h-30 rounded-full overflow-hidden border-3">
            <img
              className="w-full scale-110"
              src={`/avatars/${player.avatar}.svg`}
              alt="Avatar"
            />
          </picture>
          <button onClick={handleAvatarClick} className="absolute right-20 sm:right-15 bottom-[-8px] sm:bottom-0 cursor-pointer">
            <EditIcon />
          </button>
        </div>
      </div>
      <div className=" sm:w-sm text-sm sm:text-lg text-amber-950">
        <p>Quien conoce mejor a quien ? Reta a tus amigos creando una sala o uniendote a una.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <button onClick={()=>{handleClick("create-room")}} className="border-2 border-amber-900 px-8 py-2 text-md sm:text-lg text-white bg-amber-600/80 active:bg-lime-500 active:border-lime-800 rounded">Crear sala</button>
        
        <button onClick={()=>{handleClick("join-room")}} className="border-2 border-amber-900 px-8 py-2 text-md sm:text-lg text-white bg-amber-600/80 active:bg-lime-500 active:border-lime-800 rounded">Unirse a sala</button>
      </div>
      <BackButton route={''} />
      {isPopupOpen && (
        <div onClick={()=>{setIsPopupOpen(false)}} className="fixed inset-0 bg-gray-950/20 flex items-center justify-center">
          <div className="flex flex-col justify-between bg-white p-3 sm:p-6 rounded-lg shadow-lg">
            <h3 className="text-md sm:text-lg mb-4 text-center">Selecciona un avatar</h3>
            <div className="grid grid-cols-3 gap-2">
              {["bull", "bunny", "cat", "crocodile", "dog", "frog", "panda", "wolf"].map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => handleAvatarSelect(avatar)}
                  className="max-w-20 max-h-20 rounded-full overflow-hidden border-3 border-gray-300 hover:border-amber-950"
                >
                  <img
                    src={`/avatars/${avatar}.svg`}
                    alt={avatar}
                    className="w-full h-full object-cover scale-105"
                  />
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsPopupOpen(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Welcome;