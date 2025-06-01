const PlayerCard = ({player}) => {
  
  return (
    <div className="flex flex-col items-center gap-1">
      <picture className="w-20 h-20 sm:w-30 sm:h-30 overflow-hidden rounded-full border-3 sm:border-4 border-amber-950">
        <img className="scale-115 w-full object-cover" src={`/avatars/${player.avatar}.svg`} alt="" />
      </picture>
      <h3 className="text-xl">{player.nickname}</h3>
    </div>
  );
};

export default PlayerCard;