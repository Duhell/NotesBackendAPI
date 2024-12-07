import { body } from "express-validator";

const Register = () => {
    return [
        body('name').trim().notEmpty(),
        body('email').trim().notEmpty().isEmail(),
        body('password').trim().notEmpty()
    ]
};

const Login = () => {
    return [

        body('email').trim().notEmpty().isEmail(),
        body('password').trim().notEmpty()
    ]
}

const Notes = () => {
    return [
        body('note').optional().trim().notEmpty(),
        body('isPrivate').optional().notEmpty().toBoolean(),
        body('author').optional().trim().notEmpty(),
    ]
}

const Validation = {
    Register,
    Login,
    Notes
}

export default Validation;
