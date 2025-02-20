import multer from 'multer';
import path from 'path';

const uploadCsv = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      cb(null, `${timestamp}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5 MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['text/csv'];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Tipo de arquivo inválido. Apenas arquivos CSV são permitidos.',
        ),
      );
    }
  },
});

export { uploadCsv };
