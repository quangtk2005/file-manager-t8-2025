import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
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
  const isVercel = process.env.VERCEL === '1';
  const basePath = isVercel ? '/tmp' : path.join(__dirname, "..");
  const mediaPath = path.join(basePath, "media", path.posix.join(...dirname));

  res.sendFile(mediaPath);
}