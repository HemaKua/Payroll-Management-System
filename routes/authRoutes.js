const express = require("express");
const router = express.Router();
const authController = require('../controller/auth');
// const Joi = require('joi');
const {validateUserLogin,validateUserInvitation,validateUserforgotPassword,
    validateTenantsLogin,validateTenantsRegister,validateTenantsForgotPassword} =require('../shared/validate_Schema')
const {authenticateJWT} = require('../shared/authenticateJWT')




// user routes
// router.post('/user-signup', UserController.UserSignup);
router.post('/user-login',validateUserLogin, authController.UserLogin);
router.post('/user-forgot-password',authenticateJWT,validateUserforgotPassword, authController.userforgotPassword);
router.post('/user-Invitation',validateUserInvitation ,authController.userInvitation);




// Tenants
router.post('/tenants-signup',validateTenantsRegister ,authController.TenantSignup );
router.post('/tenants-login',validateTenantsLogin ,authController.TenantLogin );
router.post('/tenants-forgot-password',authenticateJWT,validateTenantsForgotPassword ,authController.tenantsforgotPassword);


module.exports = router;
