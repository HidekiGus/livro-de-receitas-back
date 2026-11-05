import multer from 'multer';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const uploadRecipeImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Apenas arquivos de imagem são permitidos!'));
    }
    cb(null, true);
  },
});
