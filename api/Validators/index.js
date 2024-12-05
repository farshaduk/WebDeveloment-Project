const { body, validationResult } = require('express-validator');

exports.createPostValidator = [
  body('title', 'title is required').notEmpty(),  
  body('body', 'body is required').notEmpty(), 
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0].msg;
      return res.status(400).json({ error: firstError });
    }
    next();
  }
];

exports.createContactValidator = [
  body('firstname', 'firstname is required').notEmpty(),
  body('firstname', 'firstname must be between 4 and 150 characters').isLength({ min: 4, max: 150 }),
  
  body('lastname', 'lastname is required').notEmpty(),
  body('lastname', 'lLastname must be between 4 and 150 characters').isLength({ min: 4, max: 150 }),

  body('email', 'email is required').notEmpty(),
  body('email', 'Please enter a valid email').isEmail(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0].msg;
      return res.status(400).json({ error: firstError });
    }
    next();
  }
];
exports.UserSignUpValidator = [
  body('name', 'name is required').notEmpty(),
  body('name', 'name must be between 4 and 150 characters').isLength({ min: 4, max: 150 }),
  
  body('lastname', 'Lastname is required').notEmpty(),
  body('lastname', 'Lastname must be between 4 and 150 characters').isLength({ min: 4, max: 150 }),

  body('email', 'email is required').notEmpty(),
  body('email', 'email must be between 3 and 32 characters').isLength({ min: 3, max: 32 }),
  body('email', 'Please enter a valid email')
    .isEmail()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/), 

  body('password', 'password is required').notEmpty(),
  body('password', 'password must cantain minimum 8 characters').isLength({ min: 8, max: 32 })
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
  .withMessage("Ensures at least one lowercase and uppercase  letter, least one digit, at least one special character"), 

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0].msg;
      return res.status(400).json({ error: firstError });
    }
    next();
  }
];

exports.validatePasswordUpdate = [
   body('newPassword')
      .optional() // Validation applies only if newPassword is provided
      .isLength({ min: 8, max: 32 })
      .withMessage('Password must be between 8 and 32 characters.')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .withMessage(
         'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
      ),
   (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }
      next();
   },
];
