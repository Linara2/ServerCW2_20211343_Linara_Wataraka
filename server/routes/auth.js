const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

const validationRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Invalid email').normalizeEmail(),
  body('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special chara'),
];

const validateLogin = [
  body('email').trim().isEmail().withMessage('Invalid email').normalizeEmail(),
  body('password').trim().notEmpty().withMessage('Password is required'),
];

router.post('/register', validationRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/request-reset', body('email').isEmail().withMessage('Invalid email'),authController.requestReset);
router.post('/reset-password', 
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('newPassword').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special chara'),
  ],
  authController.resetPassword
);

module.exports = router;
