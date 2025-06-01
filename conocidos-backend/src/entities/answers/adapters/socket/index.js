import { socketHandler } from "@Application/middlewares/error-handler";
import Controller from "../../controller";


const StartSocketServer = (io, socket) => {
  console.log("StartSocketServer");
  socket.on(
    "get-answers",
    socketHandler(async (questionId) => {
      const answers = await Controller.get({ questionId });
      console.log("LAS FAKIN RESPUESTAAAAAAAAAAAAAAAAAAAAS", answers);
      io.emit("fetched-answers", answers);
    })
  );

  socket.on(
    "addAlumnos",
    socketHandler(async (msg) => {
      const data = await Controller.getAll();
      console.log("aaaaaaaaaaaaaaaa", data);
    })
  );
};

export default StartSocketServer;