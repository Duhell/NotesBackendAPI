import path from 'path';
import DataUriParser from "datauri/parser.js";

const parser = new DataUriParser();

const datauri = async (req) => {
    if (!req.file || !req.file.originalname || !req.file.buffer) {
        throw new Error('Invalid file upload: Missing file or file properties');
    }
    const fileExtension = path.extname(req.file.originalname).toString();

    return parser.format(fileExtension, req.file.buffer).content;
}

export default datauri;