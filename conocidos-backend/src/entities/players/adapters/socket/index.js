import { socketHandler } from "@Application/middlewares/error-handler";
import Controller from "../../controller";

const StartSocketServer = (io, socket) => {
  console.log("Player socket active");


  socket.on(
    "addAlumnos",
    socketHandler(async (msg) => {
      const data = await Controller.getAll();
      console.log("aaaaaaaaaaaaaaaa", data);
    })
  );
};

export default StartSocketServer;
