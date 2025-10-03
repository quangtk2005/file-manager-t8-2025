import { Router } from "express";
import fileManagerRouter from "./file-manager.routes";
import mediaRouter from "./media.routes";
import * as middleware from "../middlewares/domain.middleware";
const router = Router();
router.use(middleware.checkDomain);
router.use("/file-manager", fileManagerRouter);
router.use("/media", mediaRouter);
export default router;
