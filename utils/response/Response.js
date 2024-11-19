export default class Response {
    static SUCCESS = 200;
    static CREATED = 201;
    static UNAUTHORIZED = 401;
    static FORBIDDEN = 403;
    static NOT_FOUND = 404;
    static INTERNAL_ERROR = 500;

    static send(res, statusCode, response){
        return res.status(statusCode).json({ response });
    }
}


Object.freeze(Response);