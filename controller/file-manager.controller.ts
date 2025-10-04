import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { lookup } from 'mime-types';
import { fileURLToPath } from "url";

const getUniqueFilename = (filePath: string): string => {
  if (!fs.existsSync(filePath)) return filePath;

  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const nameWithoutExt = path.basename(filePath, ext);

  let counter = 2;
  let newPath: string;

  do {
    newPath = path.join(dir, `${nameWithoutExt}-${counter}${ext}`);
    counter++;
  } while (fs.existsSync(newPath));

  return newPath;
};

export const uploadPost = async (req: Request, res: Response) => {
  try {
    const files = req.files as any;
    let saveLinks: any = []
    let errorFiles: any = []
    const { folder_path } = req.query;
    const folderPath = path.join(__dirname, '../media', folder_path as string || "");
    for await (const file of files) {
      let filename = file.originalname;
      filename = Buffer.from(filename, 'latin1').toString('utf8');
      filename = Buffer.from(filename, 'latin1').toString('utf8');

      const initialPath = path.join(folderPath, filename);
      const savePath = getUniqueFilename(initialPath);

      try {
        fs.writeFileSync(savePath, file.buffer);
        const fileExtension = path.extname(filename).toLowerCase();
        const detectedMimeType = lookup(fileExtension) || file.mimetype;
        const fileType = fileExtension.replace('.', '');
  
        saveLinks.push({
          folder: `/media${folder_path ? `/${folder_path}` : ""}`,
          filename: path.basename(savePath),
          mimetype: file.mimetype,
          size: file.size,
          filetype: fileType,
        })
      } catch (error) {
        errorFiles.push(file.originalname)
      }
    }


    res.json({
      success: true,
      message: "Upload thành công",
      data: saveLinks,
      errorFiles: errorFiles
    })
  } catch (error) {
    res.json({
      success: false,
      message: "Upload thất bại"
    })
  }

}

export const changeFilename = async (req: Request, res: Response) => {
  const { folder_path } = req.query;
  const { folder, oldName, newName } = req.body;

  const cleanFolder = folder.replace("/", "");
  const mediaDir = path.join(__dirname, "..", cleanFolder, folder_path as string || "");
  const oldPath = path.join(mediaDir, oldName);
  const fileExtension = path.extname(oldName);
  const newPath = path.join(mediaDir, newName + fileExtension);


  try {
    if (!fs.existsSync(oldPath)) {
      return res.json({
        success: false,
        message: "File không tồn tại!"
      });
    }

    if (fs.existsSync(newPath)) {
      return res.json({
        success: false,
        message: "Tên file mới đã tồn tại!"
      });
    }

    fs.renameSync(oldPath, newPath);

    res.json({
      success: true,
      message: "Đổi tên file thành công!",
      newName: newName + fileExtension
    });
  } catch (error) {
    console.error("Error renaming file:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi đổi tên file!"
    });
  }
}

export const createFolder = async (req: Request, res: Response) => {
  const { name_folder, folder_path } = req.body;


  const folderDir = path.join(__dirname, "..", folder_path, name_folder);
  try {
    if (fs.existsSync(folderDir)) {
      return res.json({
        success: false,
        message: "Thư mục đã tồn tại!"
      });
    }
    fs.mkdirSync(folderDir);
    return res.json({
      success: true,
      message: "Tạo thư mục thành công!"
    })
  } catch (error) {
    return res.json({
      success: false,
      message: "Lỗi khi tạo thư mục!"
    });
  }



}

const calculateFolderSize = (folderPath: string): { totalSize: number; fileCount: number } =>
  fs.readdirSync(folderPath, { withFileTypes: true })
    .reduce((acc: { totalSize: number; fileCount: number }, item) => {
      const itemPath = path.join(folderPath, item.name);
      const stats = fs.statSync(itemPath);

      if (item.isFile()) {
        return { totalSize: acc.totalSize + stats.size, fileCount: acc.fileCount + 1 };
      }

      const subStats: { totalSize: number; fileCount: number } = calculateFolderSize(itemPath);
      return {
        totalSize: acc.totalSize + subStats.totalSize,
        fileCount: acc.fileCount + subStats.fileCount
      };
    }, { totalSize: 0, fileCount: 0 });

export const getFolder = async (req: Request, res: Response) => {
  try {
    const mediaPath = path.join(__dirname, "..", "media", req.query.folder_path as string || "");

    const folderDetails = fs.readdirSync(mediaPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => {
        const folderPath = path.join(mediaPath, dirent.name);
        const stats = fs.statSync(folderPath);
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
  } catch (error) {
    res.json({ success: false, message: "Lỗi khi lấy thư mục!" });
  }
}

export const deleteFile = async (req: Request, res: Response) => {
  try {
    const { folder_path, filename } = req.body;
    let errorFile = []
    for await (const file of filename) {
      const pathname = path.join(__dirname, "..", "media", folder_path ? folder_path : "", file);
      try {
        fs.unlinkSync(pathname);
      } catch (error) {
        errorFile.push(file)
      }
    }
    res.json({
      success: true,
      message: "Xóa file thành công!",
      errorFile
    })
  } catch (error) {
    res.json({
      success: false,
      message: "Xóa file thất bại!",
    })
  }

}

export const deleteFolder = async (req: Request, res: Response) => {
  try {
    const { folder_path, foldername } = req.body;
    let errorFolders = []
    let folders = []
    for await (const folder of foldername) {
      const pathname = path.join(__dirname, "..", "media", folder_path ? folder_path : "", folder);
      try {
        folders.push(`/media${folder_path ? "/" + folder_path : ""}/${folder}`)
        fs.rmSync(pathname, { recursive: true, force: true });
      } catch (error) {
        console.error(`Error deleting folder ${folder}:`, error);
        errorFolders.push(`/media${folder_path ? "/" + folder_path : ""}/${folder}`)
      }
    }
    res.json({
      success: true,
      message: "Xóa thư mục thành công!",
      errorFolders,
      folders
    })
  } catch (error) {
    res.json({
      success: false,
      message: "Xóa thư mục thất bại!",
    })
  }
}