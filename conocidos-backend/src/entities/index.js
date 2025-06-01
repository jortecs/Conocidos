import userRoutes from "./players/adapters/http";
import questionRoutes from "./questions/adapters/http"
import answersRoutes from "./answers/adapters/http"
import roomsRoutes from "./rooms/adapters/http"
import roomSocket from "./rooms/adapters/socket"
import playerSocket from "./players/adapters/socket"
import questionSocket from "./questions/adapters/socket"
import answersSocket from "./answers/adapters/socket"

export const Routes = (app) => {
  userRoutes(app, "/players");
  questionRoutes(app, "/questions")
  answersRoutes(app, "/answers")
  roomsRoutes(app, "/rooms")
};

export const Sockets = (io, socket) => {
  // userSockets(io, socket); 
  roomSocket(io, socket)
  playerSocket(io, socket)
  questionSocket(io, socket)
  answersSocket(io, socket)
};
