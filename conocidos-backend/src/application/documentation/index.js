import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { swaggerConfig } from "../config/swagger";

const Documentation = (app) => {
  // JSON of specs
  const swaggerSpec = swaggerJSDoc(swaggerConfig);

  // Api entrypoint
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default Documentation;
