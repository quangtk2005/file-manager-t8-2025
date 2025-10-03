import express from "express";
import "dotenv/config";
import indexRoutes from "./routers/index.routes";
import { fileURLToPath } from "url";
import path from "path";
const app = express();
const port = parseInt(process.env.PORT) || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());
app.use(indexRoutes);
app.listen(port, () => {
    console.log(`Website đang chạy trên cổng ${port}`);
});
