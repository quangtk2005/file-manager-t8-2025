import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const getFile = (req: Request, res: Response) => {
  const { dirname } = req.params
  // const referer = req.get('referer');
  
  // if (!referer || !referer.includes('localhost:2000')) {
  //   return res.status(403).json({
  //     success: false,
  //     message: "Ko có quyền truy cập."
  //   });
  // }

  // const filename = req.params.filename;
  const mediaPath = path.join(__dirname, "../media", path.posix.join(...dirname));

  res.sendFile(mediaPath);
}