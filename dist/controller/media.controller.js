"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFile = void 0;
const path_1 = __importDefault(require("path"));
const getFile = (req, res) => {
    try {
        const { dirname } = req.params;
        const basePath = path_1.default.join(__dirname, "..");
        const mediaPath = path_1.default.join(basePath, "media", path_1.default.posix.join(...dirname));
        res.sendFile(mediaPath);
    }
    catch (error) {
    }
};
exports.getFile = getFile;
