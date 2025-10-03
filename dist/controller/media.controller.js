"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFile = void 0;
const path_1 = __importDefault(require("path"));
const getFile = (req, res) => {
    const { dirname } = req.params;
    // const referer = req.get('referer');
    // if (!referer || !referer.includes('localhost:2000')) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Ko có quyền truy cập."
    //   });
    // }
    // const filename = req.params.filename;
    const mediaPath = path_1.default.join(__dirname, "../media", path_1.default.posix.join(...dirname));
    res.sendFile(mediaPath);
};
exports.getFile = getFile;
