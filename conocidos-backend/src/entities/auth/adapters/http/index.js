import express from "express";
import Controller from "../../controller";
import { asyncHandler } from "@Application/middlewares/error-handler";
// Para operaciones con acceso restringido, introduciremos un segundo parámetro que será la variable restrictedAccess
import restrictedAccess from "@Application/middlewares/restricted-access";

const router = express.Router();

// GET ALL
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const data = await Controller.login(req.body.token);
    console.log(data);
    res.send(data);
  })
);

export default (app, entityUrl) => app.use(entityUrl, router);