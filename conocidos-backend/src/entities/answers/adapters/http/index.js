import express from "express";
import Controller from "../../controller";
import { asyncHandler } from "@Application/middlewares/error-handler";
// Para operaciones con acceso restringido, introduciremos un segundo parámetro que será la variable restrictedAccess
import restrictedAccess from "@Application/middlewares/restricted-access";

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
  "/question/:questionId",
  asyncHandler(async (req, res) => {
    const { questionId } = req.params
    if(!questionId){
      return res.status(400).send({error: "questionId is required"})
    }

    const data = await Controller.get({questionId});

    if(!data || data.length === 0){
      return res.status(404).send({error: "No answers found for the given questionId"})
    }

    res.send(data);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const {
      body: { answer_text, is_correct, questionId },
    } = req;
    const newAnswer = await Controller.create({ answer_text ,is_correct, questionId });
    res.send(newAnswer);
  })
);

export default (app, entityUrl) => app.use(entityUrl, router);
