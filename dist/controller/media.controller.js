import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const getFile = (req, res) => {
    const { dirname } = req.params;
    const mediaPath = path.join(__dirname, "../media", path.posix.join(...dirname));
    res.sendFile(mediaPath);
};
