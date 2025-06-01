import { socketHandler } from "@Application/middlewares/error-handler";
import Controller from "../../controller";
import playerController from "entities/players/controller"

let gameState = {
  // roomId: {
  //   players: new Set(['p1', 'p2']),
  //   answered: new Set(),
  // },
};

const StartSocketServer = (io, socket) => {
  console.log("Room socket active");
  socket.on(
    "playerJoins",
    socketHandler(async (roomId) => {
      // const players = await Controller.get()
      socket.join(roomId)
      const players = await playerController.get({roomId})

      if (!gameState[roomId]) {
        gameState[roomId] = {
          players: new Set(players.map((player) => player.id)), // 
          answered: new Set(),
        };
      }
      
      io.to(roomId).emit("playerHasJoined", players);
    })
  );

  socket.on("playerLeaves",
    socketHandler(async ({roomId, playerId, nickname}) => {

      await playerController.deleteById(playerId)
      const players = await playerController.get({roomId})
      if(players.length === 0){
        await Controller.delete({code: roomId})
      }

      io.to(roomId).emit("playerHasLeft", players);
    })
  );

  socket.on("playerIsReady", 
    socketHandler(async ({ roomId, playerId }) => {
      await playerController.updateById(playerId, {isReady: true})
      const roomData = await Controller.get({code: roomId})
      const maxPlayers = roomData[0].dataValues.maxPlayers

      // io.to(roomId).emit("playerMarkedReady", { playerId });
      const data = await playerController.get({roomId})
      const playersInRoom = data.length

      console.log("players currently in room: ", playersInRoom)
       const allPlayersReady = data.every(player => player.dataValues.isReady === true)

      console.log('checking if all players are ready: ', allPlayersReady, playersInRoom === maxPlayers, playersInRoom, maxPlayers)
      if (allPlayersReady && playersInRoom === maxPlayers) {
        console.log('all players ready')
        io.to(roomId).emit("allPlayersReady"); // trigger the next step of the game
      }
    })
  );
  socket.on("playerNotReady", 
    socketHandler(async ({ roomId, playerId }) => {
      await playerController.updateById(playerId, {isReady: false})
      
      // Optionally notify others
      // io.to(roomId).emit("playerMarkedReady", { playerId });
    })
  );
  socket.on("finishGame", 
    socketHandler(async (roomId ) => {
      await Controller.delete({code: roomId})
      io.to(roomId).emit("gameFinished");
    })
  );

  socket.on("room-settings-changed", 
    socketHandler(async (obj) => {
      const { roomId, room } = obj
      console.log(roomId, room)
      const code = roomId
      await Controller.update(code, room)
      io.to(roomId).emit("room-settings-changed");
    })
  );
};

export default StartSocketServer;
