// emailMiddleware.js

const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const ejs = require('ejs');
const nodemailer = require("nodemailer");
const transporter = require('./db.helper')

// Function to send registration success email
async function sendRegistrationEmail(email, templateData, templateFilePath) {
    // Get and compile the template
    const compileTemplate = getCompileTemplate(templateFilePath);
    if (!compileTemplate) {
        console.error('Error getting or compiling the HTML template');
        return false;
    }

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '8.nikhil3@gmail.com',
            pass: 'qqpl uctj qfhz hpib',
        },
    });

    // Configure email options
    const mailOptions = {
        from: '8.nikhil3@gmail.com',
        to: email,
        subject: templateData.subject,
        html: compileTemplate(templateData),
    };

    try {
        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

// Function to get and compile HTML template
function getCompileTemplate(filePath) {
    const mailFilePath = path.join(__dirname, filePath);

    try {
        const template = fs.readFileSync(mailFilePath, 'utf8');
        return ejs.compile(template);
    } catch (error) {
        console.error('Error reading or compiling the HTML template:', error);
        return null;
    }
}

module.exports = { sendRegistrationEmail };
