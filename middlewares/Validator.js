import { check, validationResult } from "express-validator";


export const userValidation = [
    check('username').isAlphanumeric().isLength({ min: 3, max: 20 }).withMessage('Invalid username'),
    check('email').isEmail().withMessage('Invalid email'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    check('dob').optional().isDate().withMessage('Invalid date of birth'),
];

export const moodValidation = [
    check('text').isLength({ max: 500 }).withMessage('Text cannot exceed 500 characters'),
    check('image').optional().isURL().withMessage('Invalid image URL'),
    check('visibility').isIn(['public', 'private', 'friends']).withMessage('Invalid visibility'),
];

export const validate = (req, res, next) => {
    const errors  = validationResult(req) 
        if(!errors.isEmpty()) {
            return res.status(400).send({"success": false, errors: errors.array()})
        }

        next()
    
}