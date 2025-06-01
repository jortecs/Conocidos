const Error = () => {
  return (
    <div className="mosaic-error min-h-screen flex items-center justify-center">
      <div className="flex flex-col justify-center items-center text-center p-2">
        <h1 className="text-base sm:text-xl">Ups página no encontrada...</h1>
        <picture className="w-full max-w-sm">
          <img className="w-full" src="/background/errorPersonajes.png" alt="error image" />
        </picture>
      </div>
    </div>
  );
};

export default Error;