import { Router } from "express";
import multer from "multer";
const upload = multer();
import * as mediaController from "../controller/media.controller";
const router = Router({ caseSensitive: true });
router.get("/*dirname", mediaController.getFile);
export default router;
