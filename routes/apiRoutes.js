const express = require("express");
const router = express.Router();
const Joi = require('joi');
const UserController = require('../controller/userController');
// const TenantsController = require('../controller/tenantsController');
const googleController =require('../controller/googleCloud');
const googleController1 =require('../controller/googleCloud1');


const userDeleteSchema = Joi.object({
    user_Email: Joi.string().email().required(),
    
    
});
const tenantsDeleteSchema = Joi.object({
    user_Email: Joi.string().email().required(),
       
});

// user 
router.get('/all-users-info', UserController.userAllInformation);
router.put('/user-edit',UserController.userEdit);
router.delete('/delete-user', UserController.deleteUsers,);
router.get('/sendDataAsPDF', UserController.sendPDFdata);

// tenants
router.delete('/delete-user',TenantsController.TenantDelete );
// router.get('/information', Information);

// Google drive file data 
// Endpoint to download and read data from an Excel file on Google Drive
router.post('/read-excel-from-drive',googleController.readFromCloudAndSave );
  
router.get('/download-excel',googleController.readFromCloudAndSave);

router.post('/import-excel',googleController.readFromCloudAndSave);

router.get('/read-file/:fileId',googleController1.readFromCloud);



module.exports = router;
