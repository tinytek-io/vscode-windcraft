import express from "express";
import { log } from "./lib/log";
import { getSimpleASTController } from "./controllers/getSimpleAST";
import { getClassNamesController } from "./controllers/getClassNames";
import { programCompileEventController } from "./controllers/programCompileEvent";

const router = express.Router();

router.post("/", getSimpleASTController);
router.post("/classnames", getClassNamesController);
router.post("/program-compile-event", programCompileEventController)

router.post("/hello", (req, res) => {
  log("Received request '/'");
  res.send({ message: "Hello World" });
});

export default router;
