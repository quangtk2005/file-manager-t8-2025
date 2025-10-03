import { NextFunction, Request, Response } from "express";

export const checkDomain = async (req: Request, res: Response, next: NextFunction) => {
  const referer = req.headers.referer;
  const ALLOWED_TO_TAKE_RESOURCES = (process.env.ALLOWED_TO_TAKE_RESOURCES as string || "").split(", ");
  if(!referer) {
    res.send("Truy cập không hợp lệ!");
    return;
  }

  for await (const domain of ALLOWED_TO_TAKE_RESOURCES) {
    if(referer.includes(domain)) {
      next();
      return;
      
    }
  }

  res.send("Truy cập không hợp lệ!");
  return;
}
