import express, { Application, Request, Response } from "express";
import "dotenv/config";
import indexRoutes from "./routers/index.routes";
import { fileURLToPath } from "url";
import path from "path";

const app: Application = express();
const port: Number = parseInt(process.env.PORT as string) || 3000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json())

app.use(indexRoutes);


app.listen(port, () => {
    console.log(`Website đang chạy trên cổng ${port}`);
});
