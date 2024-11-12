import JWT from 'jsonwebtoken';

const CookieJWTAuth = (request,respond, next) =>{
    const token = request.cookies.token;

    try {
        const user = JWT.verify(token, process.env.TOKEN);
        request.user = user;
        next();
    } catch (error) {
        request.clearCookie('token');
        return respond.json({error});
    }
}

export default CookieJWTAuth;