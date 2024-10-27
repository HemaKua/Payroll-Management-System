// Import necessary modules
const Joi = require('joi');


// Joi schema for user login
const userLoginSchema = Joi.object({
    user_Email: Joi.string().email().required(),
    user_Password: Joi.string().alphanum()
    .min(3)
    .max(30).required(),
    
}).unknown(false);
const userInvitationSchema = Joi.object({
    user_Name:Joi.string()
    .required(),
    user_Email: Joi.string().email().required(),
    
}).unknown(false);
const userForgotPasswordSchema = Joi.object({
    user_Email: Joi.string().email().required(),
    
}).unknown(false);

// Joi schema for tenants login
const tenantsLoginSchema = Joi.object({
    admin_Email: Joi.string().email().required(),
    password: Joi.string().required(),
    
}).unknown(false);
const tenantsRegisterSchema = Joi.object({
    name:Joi.string().min(3).alphanum()
    .max(30).required(),
    admin_Email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(3).max(30).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
}).unknown(false);
const tenantsForgotPasswordSchema = Joi.object({
    admin_Email: Joi.string().email().required(),
    
}).unknown(false);

// Middleware function for request validation 
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body,{aboutEarly:false});
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        next();
    };
};


// Middleware for user login validation
exports. validateUserLogin = validateRequest(userLoginSchema);

exports. validateUserInvitation = validateRequest(userInvitationSchema);

exports. validateUserforgotPassword = validateRequest(userForgotPasswordSchema);

// Middleware for tenant login validation
exports. validateTenantsLogin = validateRequest(tenantsLoginSchema);

exports. validateTenantsRegister = validateRequest(tenantsRegisterSchema);

exports. validateTenantsForgotPassword = validateRequest(tenantsForgotPasswordSchema);

