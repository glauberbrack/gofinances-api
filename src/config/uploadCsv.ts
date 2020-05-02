import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tmpFolderPath = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tmpFolderPath,
  storage: multer.diskStorage({
    destination: tmpFolderPath,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(8).toString('HEX');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
