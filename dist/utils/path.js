import { fileURLToPath } from "url";
import path from "path";
export const getProjectRoot = () => {
    const __filename = fileURLToPath(import.meta.url);
    return path.dirname(__filename);
};
export const getMediaPath = () => {
    return path.join(getProjectRoot(), "media");
};
export const getMediaFilePath = (filename) => {
    return path.join(getMediaPath(), filename);
};
