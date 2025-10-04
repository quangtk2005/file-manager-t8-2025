"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFolder = exports.deleteFile = exports.getFolder = exports.createFolder = exports.changeFilename = exports.uploadPost = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mime_types_1 = require("mime-types");
const getUniqueFilename = (filePath) => {
    if (!fs_1.default.existsSync(filePath))
        return filePath;
    const dir = path_1.default.dirname(filePath);
    const ext = path_1.default.extname(filePath);
    const nameWithoutExt = path_1.default.basename(filePath, ext);
    let counter = 2;
    let newPath;
    do {
        newPath = path_1.default.join(dir, `${nameWithoutExt}-${counter}${ext}`);
        counter++;
    } while (fs_1.default.existsSync(newPath));
    return newPath;
};
const uploadPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        const files = req.files;
        let saveLinks = [];
        let errorFiles = [];
        const { folder_path } = req.query;
        const folderPath = path_1.default.join(__dirname, '../media', folder_path || "");
        try {
            for (var _d = true, files_1 = __asyncValues(files), files_1_1; files_1_1 = yield files_1.next(), _a = files_1_1.done, !_a; _d = true) {
                _c = files_1_1.value;
                _d = false;
                const file = _c;
                let filename = file.originalname;
                filename = Buffer.from(filename, 'latin1').toString('utf8');
                filename = Buffer.from(filename, 'latin1').toString('utf8');
                const initialPath = path_1.default.join(folderPath, filename);
                const savePath = getUniqueFilename(initialPath);
                try {
                    fs_1.default.writeFileSync(savePath, file.buffer);
                    const fileExtension = path_1.default.extname(filename).toLowerCase();
                    const detectedMimeType = (0, mime_types_1.lookup)(fileExtension) || file.mimetype;
                    const fileType = fileExtension.replace('.', '');
                    saveLinks.push({
                        folder: `/media${folder_path ? `/${folder_path}` : ""}`,
                        filename: path_1.default.basename(savePath),
                        mimetype: file.mimetype,
                        size: file.size,
                        filetype: fileType,
                    });
                }
                catch (error) {
                    errorFiles.push(file.originalname);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = files_1.return)) yield _b.call(files_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        res.json({
            success: true,
            message: "Upload thành công",
            data: saveLinks,
            errorFiles: errorFiles
        });
    }
    catch (error) {
        res.json({
            success: false,
            message: "Upload thất bại"
        });
    }
});
exports.uploadPost = uploadPost;
const changeFilename = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { folder_path } = req.query;
    const { folder, oldName, newName } = req.body;
    const cleanFolder = folder.replace("/", "");
    const mediaDir = path_1.default.join(__dirname, "..", cleanFolder, folder_path || "");
    const oldPath = path_1.default.join(mediaDir, oldName);
    const fileExtension = path_1.default.extname(oldName);
    const newPath = path_1.default.join(mediaDir, newName + fileExtension);
    try {
        if (!fs_1.default.existsSync(oldPath)) {
            return res.json({
                success: false,
                message: "File không tồn tại!"
            });
        }
        if (fs_1.default.existsSync(newPath)) {
            return res.json({
                success: false,
                message: "Tên file mới đã tồn tại!"
            });
        }
        fs_1.default.renameSync(oldPath, newPath);
        res.json({
            success: true,
            message: "Đổi tên file thành công!",
            newName: newName + fileExtension
        });
    }
    catch (error) {
        console.error("Error renaming file:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi đổi tên file!"
        });
    }
});
exports.changeFilename = changeFilename;
const createFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name_folder, folder_path } = req.body;
    const folderDir = path_1.default.join(__dirname, "..", folder_path, name_folder);
    try {
        if (fs_1.default.existsSync(folderDir)) {
            return res.json({
                success: false,
                message: "Thư mục đã tồn tại!"
            });
        }
        fs_1.default.mkdirSync(folderDir);
        return res.json({
            success: true,
            message: "Tạo thư mục thành công!"
        });
    }
    catch (error) {
        return res.json({
            success: false,
            message: "Lỗi khi tạo thư mục!"
        });
    }
});
exports.createFolder = createFolder;
const calculateFolderSize = (folderPath) => fs_1.default.readdirSync(folderPath, { withFileTypes: true })
    .reduce((acc, item) => {
    const itemPath = path_1.default.join(folderPath, item.name);
    const stats = fs_1.default.statSync(itemPath);
    if (item.isFile()) {
        return { totalSize: acc.totalSize + stats.size, fileCount: acc.fileCount + 1 };
    }
    const subStats = calculateFolderSize(itemPath);
    return {
        totalSize: acc.totalSize + subStats.totalSize,
        fileCount: acc.fileCount + subStats.fileCount
    };
}, { totalSize: 0, fileCount: 0 });
const getFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mediaPath = path_1.default.join(__dirname, "..", "media", req.query.folder_path || "");
        const folderDetails = fs_1.default.readdirSync(mediaPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => {
            const folderPath = path_1.default.join(mediaPath, dirent.name);
            const stats = fs_1.default.statSync(folderPath);
            const { totalSize, fileCount } = calculateFolderSize(folderPath);
            return {
                name: dirent.name,
                fileCount,
                totalSize,
                createdAt: stats.birthtime,
                updatedAt: stats.mtime
            };
        });
        res.json({ success: true, message: "Lấy thư mục thành công!", data: folderDetails });
    }
    catch (error) {
        res.json({ success: false, message: "Lỗi khi lấy thư mục!" });
    }
});
exports.getFolder = getFolder;
const deleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_2, _b, _c;
    try {
        const { folder_path, filename } = req.body;
        let errorFile = [];
        try {
            for (var _d = true, filename_1 = __asyncValues(filename), filename_1_1; filename_1_1 = yield filename_1.next(), _a = filename_1_1.done, !_a; _d = true) {
                _c = filename_1_1.value;
                _d = false;
                const file = _c;
                const pathname = path_1.default.join(__dirname, "..", "media", folder_path ? folder_path : "", file);
                try {
                    fs_1.default.unlinkSync(pathname);
                }
                catch (error) {
                    errorFile.push(file);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = filename_1.return)) yield _b.call(filename_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        res.json({
            success: true,
            message: "Xóa file thành công!",
            errorFile
        });
    }
    catch (error) {
        res.json({
            success: false,
            message: "Xóa file thất bại!",
        });
    }
});
exports.deleteFile = deleteFile;
const deleteFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_3, _b, _c;
    try {
        const { folder_path, foldername } = req.body;
        let errorFolders = [];
        let folders = [];
        try {
            for (var _d = true, foldername_1 = __asyncValues(foldername), foldername_1_1; foldername_1_1 = yield foldername_1.next(), _a = foldername_1_1.done, !_a; _d = true) {
                _c = foldername_1_1.value;
                _d = false;
                const folder = _c;
                const pathname = path_1.default.join(__dirname, "..", "media", folder_path ? folder_path : "", folder);
                try {
                    folders.push(`/media${folder_path ? "/" + folder_path : ""}/${folder}`);
                    fs_1.default.rmSync(pathname, { recursive: true, force: true });
                }
                catch (error) {
                    console.error(`Error deleting folder ${folder}:`, error);
                    errorFolders.push(`/media${folder_path ? "/" + folder_path : ""}/${folder}`);
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = foldername_1.return)) yield _b.call(foldername_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        res.json({
            success: true,
            message: "Xóa thư mục thành công!",
            errorFolders,
            folders
        });
    }
    catch (error) {
        res.json({
            success: false,
            message: "Xóa thư mục thất bại!",
        });
    }
});
exports.deleteFolder = deleteFolder;
