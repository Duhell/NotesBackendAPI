import JWT from 'jsonwebtoken';
import Response from '../../utils/response/Response.js';


const BearerTokenAuth = (request, response, next) => {

    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {

        return Response.send(response, Response.UNAUTHORIZED, { 
            error: 'No token provided or invalid format',
            message: 'Authorization header must start with Bearer'
        });

    }

    const token = authHeader.split(' ')[1];

    try {
        const user = JWT.verify(token, process.env.TOKEN);
        request.user = user;
        next();
    } catch (error) {
        return Response.send(response, Response.FORBIDDEN, {
            error: 'Invalid or expired token',
            details: error.message
        });
    }
}

export default BearerTokenAuth;