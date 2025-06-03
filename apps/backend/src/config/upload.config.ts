import { registerAs } from '@nestjs/config';

export interface UploadConfig {
  maxFileSize: number;
  allowedTypes: string[];
  uploadPath: string;
  storageBucket: string;
}

export default registerAs('upload', (): UploadConfig => ({
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800', 10), // 50MB default
  allowedTypes: process.env.ALLOWED_FILE_TYPES 
    ? process.env.ALLOWED_FILE_TYPES.split(',')
    : ['pdf', 'doc', 'docx', 'txt', 'md', 'mp4', 'mp3', 'wav', 'm4a'],
  uploadPath: process.env.UPLOAD_PATH || '/tmp/uploads',
  storageBucket: process.env.STORAGE_BUCKET_NAME || 'buildyourownphd-storage',
})); 