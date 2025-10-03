"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileCategory = exports.detectFileType = void 0;
const mime_types_1 = require("mime-types");
const path_1 = __importDefault(require("path"));
// Magic bytes cho các file type phổ biến
const MAGIC_BYTES = {
    'ffd8ffe0': 'jpg',
    'ffd8ffe1': 'jpg',
    'ffd8ffe2': 'jpg',
    'ffd8ffe3': 'jpg',
    'ffd8ffe8': 'jpg',
    '89504e47': 'png',
    '47494638': 'gif',
    '25504446': 'pdf',
    '504b0304': 'zip',
    '504b0506': 'zip',
    '504b0708': 'zip',
    '52617221': 'rar',
    '7f454c46': 'elf',
    '4d5a9000': 'exe',
    'fffb': 'mp3',
    '494433': 'mp3',
    '664c6143': 'flac',
    '4f676753': 'ogg',
    '1a45dfa3': 'mkv',
    '000001ba': 'mpg',
    '000001b3': 'mpg'
};
const detectFileType = (buffer, filename) => {
    // Lấy extension từ filename
    const extension = path_1.default.extname(filename).toLowerCase().replace('.', '');
    // Kiểm tra magic bytes
    const hex = buffer.slice(0, 8).toString('hex').toLowerCase();
    let detectedExt = extension;
    // Tìm magic bytes match
    for (const [magic, ext] of Object.entries(MAGIC_BYTES)) {
        if (hex.startsWith(magic)) {
            detectedExt = ext;
            break;
        }
    }
    // Lấy MIME type
    const mime = (0, mime_types_1.lookup)(detectedExt) || 'application/octet-stream';
    // Phân loại file
    const isImage = mime.startsWith('image/');
    const isVideo = mime.startsWith('video/');
    const isAudio = mime.startsWith('audio/');
    const isDocument = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument'].some(doc => mime.includes(doc));
    return {
        ext: detectedExt,
        mime,
        isImage,
        isVideo,
        isAudio,
        isDocument
    };
};
exports.detectFileType = detectFileType;
const getFileCategory = (mime) => {
    if (mime.startsWith('image/'))
        return 'image';
    if (mime.startsWith('video/'))
        return 'video';
    if (mime.startsWith('audio/'))
        return 'audio';
    if (mime.startsWith('text/'))
        return 'text';
    if (mime.includes('pdf') || mime.includes('document'))
        return 'document';
    if (mime.includes('zip') || mime.includes('rar'))
        return 'archive';
    return 'other';
};
exports.getFileCategory = getFileCategory;
