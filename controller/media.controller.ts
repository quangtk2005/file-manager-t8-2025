import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
export const getFile = (req: Request, res: Response) => {
  try {
    const { dirname } = req.params
    const basePath = path.join(__dirname, "..");
    const mediaPath = path.join(basePath, "media", path.posix.join(...dirname));

    res.sendFile(mediaPath);
  } catch (error) {

  }
}