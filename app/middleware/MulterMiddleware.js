import multer from "multer";

export const uploadMulterImage = multer({
    storage: multer.memoryStorage(),
    limits: {fieldSize: 20_000_000},
    fileFilter: (req, file, cb) => {
        if(file.mimetype.startsWith('image/')) cb(null,true);
        else cb(new Error("Not an image"), false);
    }
}); 