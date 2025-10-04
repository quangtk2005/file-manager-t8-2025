import express, { Request, Response, Router } from "express";
import fileManagerRouter from "./file-manager.routes";
import mediaRouter from "./media.routes";
import * as middleware from "../middlewares/domain.middleware";
const router = Router();

router.use("/file-manager", fileManagerRouter);

router.use("/media", middleware.checkDomain, mediaRouter);

export default router;