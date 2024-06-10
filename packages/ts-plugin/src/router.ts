import express from "express";
import { logger } from "@windcraft/utilities/logger/logger";
import { getSimpleASTController } from "./controllers/getSimpleAST";
import { getClassNamesController } from "./controllers/getClassNames";
import { programCompileEventController } from "./controllers/programCompileEvent";

const router = express.Router();

router.post("/", getSimpleASTController);
router.post("/classnames", getClassNamesController);
router.post("/program-compile-event", programCompileEventController)

router.post("/hello", (req, res) => {
  logger.log("Received request '/'");
  res.send({ message: "Hello World" });
});

export default router;
