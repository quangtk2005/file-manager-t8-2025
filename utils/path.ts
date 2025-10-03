import { fileURLToPath } from "url";
import path from "path";

// Utility function để lấy đường dẫn thư mục gốc
export const getProjectRoot = (): string => {
  const __filename = fileURLToPath(import.meta.url);
  return path.dirname(__filename);
};

// Utility function để lấy đường dẫn media folder
export const getMediaPath = (): string => {
  return path.join(getProjectRoot(), "media");
};

// Utility function để lấy đường dẫn file trong media
export const getMediaFilePath = (filename: string): string => {
  return path.join(getMediaPath(), filename);
};
