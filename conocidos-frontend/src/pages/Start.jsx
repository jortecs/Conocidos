import { useEffect, useState } from "react";
import { useTriviaStore } from "../store/store";
import { useNavigate } from "react-router-dom";

const Start = () => {
  const navigate = useNavigate()
  const {player, setPlayer} = useTriviaStore(state => state)
  const isNicknameComplete = player.nickname.length>0
  const [avatars, setAvatars] = useState(["bull", "bunny", "cat", "crocodile", "dog", "frog", "panda", "wolf"])
  
  const handleChange = event => {
    setPlayer({...player, nickname: event.target.value})
  }

  const handleClick = avatar => {
    setPlayer({...player, avatar: avatar})
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate("/welcome")
  }

  useEffect(() => {
    setPlayer({...player, score: 0, avatar:""})
  }, [])
  

  return (
    <div className="mosaic-avatar flex flex-col gap-5 p-2 justify-center items-center  sm:min-h-screen">
      {/* <h1 className="text-center text-lg sm:text-xl md:text-3xl font-medium">Super Trivia Party</h1> */}
      <div className="w-full max-w-3xl flex flex-col justify-center items-center">
        <picture>
          <img className="w-1/2 sm:w-1/4 mx-auto" src="/logo.png" alt="logo icon" />
        </picture>
        {/* <picture>
          <img className="w-sm" src="/thumbnail.png" alt="" />
        </picture> */}
      </div>
      <div 
        className="w-full sm:max-w-2/3 flex flex-col justify-center"
      >
        <form onSubmit={(event) => {
         handleSubmit(event)
        }} className="bg-orange-200 shadow flex flex-col p-2 sm:p-4 rounded-lg gap-1 border-2 border-amber-950">
          <div className="flex flex-col gap-2 text-center ">
            <label className="text-lg">Ingresa tu apodo</label>
            <input required value={player.nickname} onChange={(event)=>{
              handleChange(event)
            }} className="mb-2 bg-white p-3 rounded w-full outline-0 focus:outline-2 focus:outline-amber-900 text-center" type="text" />
          </div>
          <div className="flex flex-col gap-2 text-center">
            <label className="font-extralight">Escoge un avatar</label>
            <div className="grid gap-2 sm:grid-cols-6 md:grid-cols-8 grid-cols-4 mb-2">
              {avatars.map(avatar => {
                return(
                  <button type="button" onClick={()=>{ handleClick(avatar) }} className={`rounded-md ${ player.avatar === avatar ? "outline-3" : ""} overflow-hidden cursor-pointer outline-amber-700`} key={avatar}>
                    <img className="scale-115 object-cover"  src={`avatars/${avatar}.svg`} alt={`${avatar} avatar`} />
                  </button>
                )
              })}
            </div>
          </div>
          { isNicknameComplete &&
            <button type="submit" className="mx-auto w-full max-w-sm border-2 border-amber-900 px-8 py-2 text-lg text-white bg-amber-600/80 active:bg-lime-500 active:border-lime-800 rounded">
              Play
            </button>
          }
        </form>
      </div>
    </div>
  );
};

export default Start;