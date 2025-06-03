import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { SupabaseService } from '../database/supabase.service';
import uploadConfig from '../config/upload.config';
import { defaultLogger, FileError, ErrorCodes } from '@buildyourownphd/utils';
import * as path from 'path';
import * as crypto from 'crypto';

export interface UploadedFile {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url?: string;
  checksum: string;
}

@Injectable()
export class UploadService {
  private logger = defaultLogger;

  constructor(
    @Inject(uploadConfig.KEY)
    private config: ConfigType<typeof uploadConfig>,
    private supabaseService: SupabaseService,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    userId: string,
    folder: string = 'uploads'
  ): Promise<UploadedFile> {
    try {
      // Validate file
      this.validateFile(file);

      // Generate unique filename
      const fileId = crypto.randomUUID();
      const extension = path.extname(file.originalname);
      const fileName = `${fileId}${extension}`;
      const filePath = `${folder}/${userId}/${fileName}`;

      // Calculate checksum
      const checksum = crypto.createHash('md5').update(file.buffer).digest('hex');

      // Upload to Supabase storage
      const storage = await this.supabaseService.storage();
      const { data, error } = await storage
        .from(this.config.storageBucket)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        this.logger.error('File upload failed', error);
        throw new FileError(
          'File upload failed',
          ErrorCodes.FILE_UPLOAD_FAILED,
          { error: error.message }
        );
      }

      // Get public URL
      const { data: urlData } = storage
        .from(this.config.storageBucket)
        .getPublicUrl(filePath);

      const uploadedFile: UploadedFile = {
        id: fileId,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: filePath,
        url: urlData.publicUrl,
        checksum,
      };

      this.logger.info('File uploaded successfully', {
        fileId,
        originalName: file.originalname,
        size: file.size,
        userId,
      });

      return uploadedFile;
    } catch (error) {
      if (error instanceof FileError || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Unexpected error during file upload', error);
      throw new FileError(
        'File upload failed',
        ErrorCodes.FILE_UPLOAD_FAILED,
        { error: error.message }
      );
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      const storage = await this.supabaseService.storage();
      const { error } = await storage
        .from(this.config.storageBucket)
        .remove([filePath]);

      if (error) {
        this.logger.error('File deletion failed', error);
        throw new FileError(
          'File deletion failed',
          ErrorCodes.STORAGE_ERROR,
          { error: error.message }
        );
      }

      this.logger.info('File deleted successfully', { filePath });
    } catch (error) {
      if (error instanceof FileError) {
        throw error;
      }
      this.logger.error('Unexpected error during file deletion', error);
      throw new FileError(
        'File deletion failed',
        ErrorCodes.STORAGE_ERROR,
        { error: error.message }
      );
    }
  }

  private validateFile(file: Express.Multer.File): void {
    // Check file size
    if (file.size > this.config.maxFileSize) {
      throw new BadRequestException(
        `File too large. Maximum size is ${this.config.maxFileSize} bytes`
      );
    }

    // Check file type
    const extension = path.extname(file.originalname).toLowerCase().slice(1);
    if (!this.config.allowedTypes.includes(extension)) {
      throw new BadRequestException(
        `Unsupported file type: ${extension}. Allowed types: ${this.config.allowedTypes.join(', ')}`
      );
    }

    // Check for empty file
    if (file.size === 0) {
      throw new BadRequestException('File is empty');
    }
  }

  getFileExtension(filename: string): string {
    return path.extname(filename).toLowerCase().slice(1);
  }

  generateFileId(): string {
    return crypto.randomUUID();
  }
} 