import express from "express";
import Controller from "../../controller";
import { asyncHandler } from "@Application/middlewares/error-handler";
// Para operaciones con acceso restringido, introduciremos un segundo parámetro que será la variable restrictedAccess
import restrictedAccess from "@Application/middlewares/restricted-access";
import roomController from "entities/rooms/controller"
const router = express.Router();

// router.get(
//   "/",
//   asyncHandler(async (req, res) => {
//     // await Controller.create({ email: 'borrame@borrame.com' });
//     res.send("Llegamos a user");
//   })
// );

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const data = await Controller.get();
    res.send(data);
  })
);

router.get(
  "/nickname/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await Controller.getById(id);
    res.send(data);
  })
);

router.delete("/delete",
  asyncHandler(async (req, res) => {
    // const { playerId } = req.params;
    const { roomId, nickname } = req.body
    if (!nickname) {
      return res.status(400).send({ error: "nickname is required" });
    }

    // const data = await Controller.deleteById(playerId)
    const deleted = await Controller.delete({ roomId, nickname })
    const roomPlayers = await Controller.get({ roomId })
    const roomEmpty = roomPlayers.length === 0
    if (roomEmpty) {
      await roomController.delete({ code: roomId })
    }
    if (deleted === 0) {
      return res.status(404).send({ error: `Player with id ${nickname} not found` });
    }

    res.send({ message: `Player  ${nickname} deleted successfully` });
  })
)

router.put("/update/:playerId",
  asyncHandler(async (req, res) => {
    const { playerId } = req.params;
    const updateData = req.body
    if (!playerId) {
      return res.status(400).send({ error: "playerId is required" });
    }

    const data = await Controller.updatePlayer({ id: playerId }, updateData);

    if (data[0] === 0) {
      return res.status(404).send({ error: `Player with id ${playerId} not found` });
    }

    res.send(data);
  })
)

router.get(
  "/:roomId",
  asyncHandler(async (req, res) => {
    const { roomId } = req.params;

    if (!roomId) {
      return res.status(400).send({ error: "roomId is required" });
    }

    const data = await Controller.get({ roomId });

    if (!data || data.length === 0) {
      return res.status(404).send({ error: "No players found for the given roomId" });
    }

    res.send(data);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const {
      body: { nickname, avatar, isReady, score, roomId },
    } = req;

    const roomExist = await Controller.getRoom(roomId)
    if (roomExist.length === 0) {
      console.log(roomExist)
      return res.status(400).send("Room does not exist")
    }
    const newPlayer = await Controller.create({ nickname, avatar, score, roomId })
    res.send(newPlayer);
  })
);

export default (app, entityUrl) => app.use(entityUrl, router);
