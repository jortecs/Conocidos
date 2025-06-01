import { socketHandler } from "@Application/middlewares/error-handler";
import Controller from "../../controller";

const shuffle = (array) => {
  return array.sort(() => Math.random() - 0.5);
}

const StartSocketServer = (io, socket) => {
  console.log("Question socket active");
  socket.on(
    "get-questions",
    socketHandler(async (obj) => {
      const { roomId, playerId } = obj;
      const convertedId = Number(playerId)
      const questions = await Controller.get({ roomId });
      const AllshuffledQuestions = shuffle(questions);
      const FinalQuestions = AllshuffledQuestions.filter(questions => questions.playerId !== convertedId)
      io.to(roomId).emit("fetched-questions", FinalQuestions);
    })
  );
  socket.on(
    "game-reset",
    socketHandler(async (roomId) => {
      await Controller.delete({roomId})
      io.to(roomId).emit("play-again");
    })
  );

};

export default StartSocketServer;
