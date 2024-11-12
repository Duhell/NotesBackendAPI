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

const Validation = {
    Register,
    Login
}

export default Validation;
