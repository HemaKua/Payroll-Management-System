const knex = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
var generator = require('generate-password');
const {  sendRegistrationEmail } = require('../shared/sendMailNodemailerr');
const { find, update, insert } = require('../shared/db.helper');
const { userNotFoundError } = require('../shared/commonStatements');
const Joi = require('joi');




// Tenants Login 
exports.TenantLogin = async (req, res) => {
    try {
        const { admin_Email, password } = req.body;
        console.log('req body', req.body);


        // Retrieve tenant information
        // const tenant = await knex("tenants")
        //     .where({ admin_Email })
        //     .select("id", "password", "admin_email")
        //     .first();

        const tenant = await find("tenants", { admin_Email }, ["id", "password", "admin_email"]);
        

        console.log('tenant data :', tenant)
        if (!tenant) {
            return userNotFoundError(res, "Tenant not found")
        }

        // Check if the provided password matches the stored hashed password

        const passwordMatch = await bcrypt.compare(password, tenant.password);
        console.log('match password', passwordMatch);

        // const hashedPassword = await bcrypt.hash(password, 10);
        // var passwordMatch = hashedPassword == tenant.password;
        // console.log('password match :', passwordMatch);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid credentials Password" });
        }

        // JWT authentication done here 
        // console.log('secret key', process.env.JWT_SECRET_KEY);
        const token = jwt.sign({ email: tenant.admin_Email, password: tenant.password },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRY });
        console.log('token', token);


        res.json({ tenantId: tenant.id, message: "Tenant Login Successful", token });
        console.log('Login sucessful');  // check for login sucess 
    } catch (error) {
        console.error('error:', error);
        res.status(500).json({ msg: "Internal Server Error", error: error.message });
    }
};

// Users Login
exports.UserLogin = async (req, res) => {
    const { user_Email, user_Password } = req.body;

    try {
        // Step 1: Retrieve user information
        // const user = await knex("users")
        //     .where({ user_Email })
        //     .select("user_Id", "Status", "user_Password", "tenant_Id", "login_Attempts", "account_Locked", "last_Failed_Attempt")
        //     .first();


        const user = await find("users", { user_Email }, ["user_Id", "Status", "user_Password", "tenant_Id", "login_Attempts", "account_Locked", "last_Failed_Attempt"])
        if (!user) {
            // Step 2: User not found
            return res.status(404).json({ error: "User not found" });
        }


        // Step 3: Check if the account is locked
        if (user.account_Locked) {
            console.log('account locked for 30 min now!');
            const lockExpirationTime = new Date(user.last_failed_attempt).getTime()  // 30 minutes in milliseconds
            const currentTime = new Date().getTime();

            if (currentTime < lockExpirationTime) {
                // Account is still locked
                const remainingTime = Math.ceil((lockExpirationTime - currentTime) / (60 * 1000)); // Remaining time in minutes
                return res.status(403).json({ error: `Account is locked. Please try again later after ${remainingTime} minutes.` });
            } else {
                // Reset login_attempts and unlock the account

                try {
                    // await knex("users")
                    //     .where({ user_Email }) // Use the correct column name for the where clause
                    //     .update({
                    //         login_Attempts: 0,
                    //         account_Locked: false,
                    //         last_Failed_Attempt: null,
                    //     });
                    await update("users", { user_Email }, {
                        login_Attempts: 0,
                        account_Locked: false,
                        last_Failed_Attempt: null,
                    })

                    console.log(`Login attempts reset successfully for user: ${user_Email}`);
                } catch (error) {
                    console.error('Error resetting login attempts:', error);
                }
            }
        }

        // Step 4: Check if the user's status is "Inactive" and update it to "Active"
        if (user.Status !== "Active") {
            // await updateUserStatus(user.user_email, "Active");
            try {
                // await knex("users")
                //     .where({ user_Email })
                //     .update({
                //         Status: "Active",
                //     });
                await update("users", { user_Email }, { Status: "Active" })

                console.log(` User status updated successfully: ${user_Email} `);
                // console.log(`User status updated successfully: ${user_email} to ${newStatus}`);
            } catch (error) {
                console.error('Error updating user status:', error);
            }
        }

        // Step 5: Check if the provided password matches the stored hashed password
        const passwordMatch = await bcrypt.compare(user_Password, user.user_Password);

        if (!passwordMatch) {
            // Update login_attempts count
            const loginAttempts = user.login_Attempts + 1;

            if (loginAttempts >= 3) {
                // Lock the account and set the lock expiration time
                // await lockAccount(user.user_email);
                const lockExpirationTime = new Date();
                lockExpirationTime.setMinutes(lockExpirationTime.getMinutes() + 30);

                // await knex("users")
                //     .where({ user_Email })
                //     .update({
                //         login_Attempts: 0,
                //         account_Locked: true,
                //         last_Failed_Attempt: lockExpirationTime,
                //     });
                await update("users", { user_Email }, { login_Attempts: 0, account_Locked: true, last_Failed_Attempt: lockExpirationTime, })
                return res.status(403).json({ error: "Max 3 attempts passed. Account locked for 30 mins. Please try again later." });
            }

            // Reset login_attempts on successful login
            // await updateLoginAttempts(user.user_email, loginAttempts);
            const lastFailedAttempt = new Date();

            // await knex("users")
            //     .where({ user_Email })
            //     .update({
            //         login_Attempts: loginAttempts,
            //         last_Failed_Attempt: lastFailedAttempt,
            //     });
            await update("users", { user_Email }, {
                login_Attempts: loginAttempts,
                last_Failed_Attempt: lastFailedAttempt,
            })

            return res.status(401).json({ error: "Invalid credentials. Password not correct." });
        }

        // Step 6: Reset login_attempts on successful login

        try {
            console.log('update on last_Failed_Attempt on successful login ')
            // await knex("users")
            //     .where({ user_Email }) // Use the correct column name for the where clause
            //     .update({
            //         login_Attempts: 0,
            //         account_Locked: false,
            //         last_Failed_Attempt: null,
            //     });
            await update("users", { user_Email }, {
                login_Attempts: 0,
                account_Locked: false,
                last_Failed_Attempt: null,
            })

            console.log(`Login attempts reset successfully for user: ${user_Email}`);
        } catch (error) {
            console.error('Error resetting login attempts:', error);
        }


        // Step 7: JWT authentication
        const token = jwt.sign(
            {
                user_Id: user.user_Id,
                tenant_Id: user.tenant_Id
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRY });

        res.json({ userId: user.user_Id, Status: user.Status, message: "User Login Successful", token });
    } catch (error) {
        console.error('error:', error);
        res.status(500).json({ msg: "Internal Server Error", error: error.message });
    }
};

// User Invitation
exports.userInvitation = async (req, res) => {
    const { user_Name, user_Email } = req.body;
    console.log("req body", req.body);

    try {
        // Check if user already exists
        const existingUser = await find("users", { user_Email }, "user_id");
        console.log('Existing user:', existingUser);

        if (existingUser) {
            return res.status(400).json({ error: "Email already exists with someone else." });
        }

        // If user doesn't exist, proceed with user creation
        const user_Password = generator.generate({
            length: 10,
            numbers: true,
            uppercase: false,
            excludeSimilarCharacters: true,
            strict: true,
        });
        console.log('generated password >>>', user_Password);

        const hashedPassword = await bcrypt.hash(user_Password, 10);

        const userdata = await insert("users", { user_Email }, {
            user_Name,
            user_Email,
            user_Password: hashedPassword,
            Status: "In-Active",
            login_Attempts: 0,
            account_Locked: false,
        });
        console.log('User created successfully.', userdata);

        const emailTemplateData = {
            subject: ' USER INVITATION MAIL ',
            email: user_Email,
            password: user_Password,
            dynamicText: "Congratulations! You've just become a part of our vibrant and artistic community. Get ready to explore creativity in every corner.Feel free to express yourself and share your artistic journey with others. Ready to get started?"
        };

        const templateFilePath = "../views/userInvitation.ejs";
        
        // Send registration success email
        const success = await sendRegistrationEmail(user_Email, emailTemplateData, templateFilePath);
        if (!success) {
            throw new Error('Failed to send email');
        }

        // Send response
        res.json({ message: " User Invitation is made and mail is sent .",  userdata });

    } catch (error) {
        console.log('error msg:', error);
        res.status(500).json({ msg: "internal server error", error: error.message });
    }
}


// exports.UserSignup = async (req, res) => {

//     try {
//         const { user_Name, user_Email, user_Password, confirm_Password, tenantId } = req.body;
//         console.log('req body======>', req.body);
//         console.log('req bodyuser_name', req.body.user_Name);
//         console.log('Received data:',
//             { user_Name, user_Email, user_Password, confirm_Password, tenantId });

//         if (!user_Name || !user_Email || !user_Password || !confirm_Password) {
//             console.log('Missing required fields');
//             return res.status(400).json({ error: 'Missing required fields' });
//         }

//         // Check if the user with the same email already exists
//         // const existingUser = await knex("users").where({ user_Email, tenant_Id: tenantId }).select("user_id").first();
//         const existingUser = awaitfind("users", { user_Email }, "user_id")
//         console.log('Existing user:', existingUser);

//         if (existingUser) {
//             return res.status(409).json({ error: "User with this email already exists" });
//         }

//         if (user_Password !== confirm_Password) {
//             console.log('Password and confirm password do not match');
//             return res.status(400).json({ error: 'Password and confirm password do not match' });
//         }

//         // Hash the user's password before storing it in the database
//         const hashedPassword = await bcrypt.hash(user_Password, 10);

//         // Send registration success email using Handlebars template
//         const emailTemplateData = {
//             subject: 'Registration Successful',
//             user_Email,
//             user_Password,
//         };

//         // Get and compile the template
//         const compileTemplate = getCompileTemplate();
//         if (!compileTemplate) {
//             console.error('Error getting the HTML template');
//             return res.status(500).json({ msg: "Internal Server Error" });
//         }
//         // Send registration success email
//         //  sendRegistrationEmail(user_email,'Registration Successful',`Thank you for registering with our service. Your registration was successful! Name:${user_name} Email:${user_email} Password:${user_password} `);
//         sendRegistrationEmail(user_Email, emailTemplateData, compileTemplate);

//         // Insert new user without specifying user_id
//         const [userId] = await knex("users").insert({
//             tenant_id: tenantId,
//             user_Name,
//             user_Email,
//             user_Password: hashedPassword,
//         });


//         console.log('User created successfully:', userId);


//         res.json({ userId, message: "User Created !!" });
//     } catch (error) {
//         console.error('error:', error);
//         res.status(500).json({ msg: "Internal Server Error", error: error.message });
//     }
// };


//Tenants Registration 
exports.TenantSignup = async (req, res) => {
    try {
        const { name, admin_Email, password, confirmPassword } = req.body;
        console.log('Request body:', { name, admin_Email, password, confirmPassword });  // Logging specific properties


        // Check if the email is already present in the table
        // const existingTenant = await knex("tenants").where({ admin_Email }).first();
        const existingTenant = await find("tenants", { admin_Email },)
        if (existingTenant) {
            return res.status(400).json({ error: "Email already exists with someone else." });
        }
        console.log('existing Tenant data:', existingTenant);  // Logging existing tenant data

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword);

        // Insert tenant details into the tenants table
        // const [tenantId] = await knex("tenants").insert({
        //     name,
        //     admin_Email,
        //     password: hashedPassword,
        // }, 'id');
        const tenantData = await insert("tenants", { admin_Email }, {
            name,
            admin_Email,
            password: hashedPassword,
        })

        // Send registration success email using Handlebars template
        const emailTemplateData = {
            subject: 'Tenant/Organization Registration Successful',
            email: admin_Email,
            password,
            dynamicText: "Congratulations! You've just become a part of our vibrant and artistic community. Get ready to explore creativity in every corner.Feel free to express yourself and share your artistic journey with others. Ready to get started?"

        };
        console.log('Mail data:', emailTemplateData);  // Logging email template data

        // Get and compile the template
        const templateFilePath = "../views/userInvitation.ejs";
        
        // Send registration success email
        const success = await sendRegistrationEmail(admin_Email, emailTemplateData, templateFilePath);
        if (!success) {
            throw new Error('Failed to send email');
        }

        res.status(201).json({ message: "Registration Successful", name, admin_Email, password, Password: hashedPassword });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error", error: error.message });
    }
}

//Tenants forgotpassword
exports.tenantsforgotPassword = async (req, res) => {
    // res.send('running forgot pass api ')
    const { admin_Email } = req.body;
    console.log('req.body:',req.body);

    try {

        // Retrieve admin information
        // const admin = await knex("tenants")
        //     .where({ admin_Email })
        //     .select("id")
        //     .first();
        const admin = await find("tenants", { admin_Email }, "id");
        console.log('found tenant :',admin);
        if (!admin) {
            return userNotFoundError(res, "Tenant not found")
        }

        // Send registration success email using Handlebars template
        const emailTemplateData = {
            subject: 'Mail FORGOT PASSWORD for Tenants',
            email: admin_Email,
            dynamicText: "Congratulations! You've just become a part of our vibrant and artistic community.You have requested for forgot password ."

        };

        const templateFilePath = "../views/forgotPassword.ejs";
        // res.render(templateFilePath, emailTemplateData);
        const success = await sendRegistrationEmail(admin_Email, emailTemplateData, templateFilePath);
        if (!success) {
            throw new Error('Failed to send email');
        }
        
       

        res.json({ message: "Password reset mail sent successfully" ,});
        // console.log('Password reset token sent successfully');
    } catch (error) {
        console.error('error:', error);
        res.status(500).json({ msg: "Internal Server Error", error: error.message });
    }
}

//Users forgot password
exports.userforgotPassword = async (req, res) => {
    const { user_Email } = req.body;
    // if (!user_Email) {
    //     console.log('missing email field');
    //     res.json({ msg: " missing field user email " })
    // }

    try {
        // Check if the user with the given email exists
        // const user = await knex('users').where({ user_Email }).first();
        const user = await find('users', { user_Email }, );
        console.log(' user found:', user);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log("user details", user);

        // check if account is locked or not 
        console.log('user account status :', user.account_Locked);
        if (user.account_Locked) {
            return res.status(403).json({ error: 'Account is locked. Please try again later.' });
        }


        const emailTemplateData = {
            subject: ' Mail for Forgot Password ',
            email: user_Email,
            dynamicText: "Congratulations! You've a part of our vibrant and artistic community.You have requested for forgot password ."
        };

        const templateFilePath = "../views/forgotPassword.ejs";
        // res.render(templateFilePath, emailTemplateData);
        const success = await sendRegistrationEmail(user_Email, emailTemplateData, templateFilePath);
        if (!success) {
            throw new Error('Failed to send email');
        }

        // For testing purposes, we'll just send it in the response
        res.json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

