import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  const { mimetype } = file;
  if (
    mimetype.split('/')[0] === 'image' ||
    mimetype === 'application/pdf' ||
    mimetype === 'text/csv'
  ) {
    callback(null, true);
  } else {
    callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE'));
  }
};

const limits: multer.Options['limits'] = {
  fileSize: process.env.AWS_MAX_FILE_SIZE * 1024 * 1024,
  files: 5,
};

export const upload = multer({ storage, fileFilter, limits });
