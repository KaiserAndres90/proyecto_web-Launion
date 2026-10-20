import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';

const directorioUploads = fileURLToPath(
  new URL('../../uploads/', import.meta.url)
);

const extensionesPermitidas = new Set(['.pdf', '.jpg', '.jpeg']);
const tiposMimePermitidos = new Set(['application/pdf', 'image/jpeg']);

const storage = multer.diskStorage({
  destination(_req, _file, callback) {
    fs.mkdir(directorioUploads, { recursive: true }, (error) => {
      callback(error, directorioUploads);
    });
  },
  filename(_req, file, callback) {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${crypto.randomUUID()}${extension}`);
  },
});

const fileFilter = (_req, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const archivoPermitido =
    extensionesPermitidas.has(extension) &&
    tiposMimePermitidos.has(file.mimetype);

  if (!archivoPermitido) {
    const error = new Error('Solo se permiten archivos PDF o JPG.');
    error.statusCode = 400;
    return callback(error);
  }

  callback(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
});

export const subirDocumento = upload.single('documento');
export const subirDocumentos = upload.array('documentos', 5);

export default upload;
