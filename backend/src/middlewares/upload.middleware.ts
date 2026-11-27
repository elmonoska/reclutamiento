import multer from 'multer';
import { Request } from 'express';
import { APP_ERROR } from '../constants/errors.constants';
import { RESUME_ALLOWED_MIME_TYPES, RESUME_MAX_FILE_SIZE_BYTES } from '../constants/upload.constants';

export const uploadResume = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: RESUME_MAX_FILE_SIZE_BYTES },
    fileFilter: (_req: Request, file, cb) => {
        if (!RESUME_ALLOWED_MIME_TYPES.includes(file.mimetype as any)) {
            return cb(new Error(APP_ERROR.INVALID_FILE_TYPE));
        }
        cb(null, true);
    }
}).single('resume');
