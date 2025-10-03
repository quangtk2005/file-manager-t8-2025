import { lookup } from 'mime-types';
import path from 'path';

// Magic bytes cho các file type phổ biến
const MAGIC_BYTES: { [key: string]: string } = {
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

export interface FileInfo {
  ext: string;
  mime: string;
  isImage: boolean;
  isVideo: boolean;
  isAudio: boolean;
  isDocument: boolean;
}

export const detectFileType = (buffer: Buffer, filename: string): FileInfo => {
  // Lấy extension từ filename
  const extension = path.extname(filename).toLowerCase().replace('.', '');
  
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
  const mime = lookup(detectedExt) || 'application/octet-stream';
  
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

export const getFileCategory = (mime: string): string => {
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('audio/')) return 'audio';
  if (mime.startsWith('text/')) return 'text';
  if (mime.includes('pdf') || mime.includes('document')) return 'document';
  if (mime.includes('zip') || mime.includes('rar')) return 'archive';
  return 'other';
};
