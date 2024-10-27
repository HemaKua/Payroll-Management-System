const knex = require("../config/db");
const dotenv = require('dotenv').config();
const nodemailer = require("nodemailer");

const fs = require('fs');
const pdf = require('html-pdf');



exports.find = async (tableName, findWhere, selectItem) => {
    try {
        const result = await knex(tableName)
            .where(findWhere)
            .select(selectItem)
            .first();
        return result  // Return an empty object if result is undefined
    } catch (error) {
        console.error('Error executing SQL query:', error);
        throw error;
    }
}

exports.update = async (tableName, findWhere, updateFields) => {
    try {
        if (!findWhere || !updateFields) {
            throw new Error('Missing required parameters'); // Handle missing parameters
        }
        await knex(tableName)
            .where(findWhere)
            .update(updateFields);
    } catch (error) {
        console.error('Error updating database:', error);
        throw error;
    }
}


exports.insert=async(tableName,findWhere,insertData)=>{
    await knex(tableName).where(findWhere).insert(insertData);
}

exports.delete=async()=>{
    try {
        // Delete users based on the specified conditions
        const deletedCount = await knex("users")
            .where({ user_Email })
            .del();

        if (deletedCount === 0) {
            return res.status(404).json({ error: "No users found matching the criteria" });
        }

        res.json({ message: `Deleted ${deletedCount} user(s) successfully` });
    } catch (error) {
        console.error('error:', error);
        res.status(500).json({ msg: "Internal Server Error", error: error.message });
    }
}

exports. transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.Gmail_user,
        pass: process.env.Gmail_pass,
    },
});



// Function to generate PDF
exports.generatePDF = (data) => {

    
    const htmlContent = `
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pay Slip</title>
<style>
    / Overall styles for the app /
    .App {
        font-family: Arial, sans-serif;
        padding: 20px;
    }

    / Styles for the heading /
    h1 {
        color: #424040;
        padding-left: 50px;
    }

    / Styles for employee summary section /
    .employee-summary {
        border: 1px solid #ccc;
        padding: 10px;
        margin-top: 20px;
    }

    .address {
        padding-left: 9.2%;
        margin-top: -20px;
    }

    .header {
        display: flex;
        align-items: center;
    }

    .logo {
        height: auto;
        margin-right: 10px; / Add space between logo and title /
    }

    .title {
        font-size: 24px;
        color: #333;
    }

    / Styles for the table /
    .employee-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
    }

    / Styles for table headers /
    .employee-table th {
        border: 1px solid #ddd;
        padding: 8px;
        background-color: #f2f2f2;
    }

    / Styles for table cells /
    .employee-table td {
        border: 1px solid #ddd;
        padding: 8px;
    }

    / Styles for the first and last cells of each row /
    .employee-table th:first-child,
    .employee-table td:first-child {
        border-left: none;
    }

    .employee-table th:last-child,
    .employee-table td:last-child {
        border-right: none;
    }
</style>
</head>
<body>
<div class="App">
    <header class="header">
        <div class="logo">
            <img src="http://demo.azikya.com/wp-content/uploads/2023/06/logo-trasparent-1.png" alt="Company Logo" class="logo"> <!-- Assuming logo.png is in the same directory as your HTML file -->
            <!-- Logo on the left -->
        </div>
        <div class="header-main">
            <h1>Azikya Software Solution</h1>
            <p class='address'>A-18 Basement, Gate No. 3, Sainik Colony, Sector 49, Faridabad-121001</p><br>
        </div>
    </header>
    <div>
        <strong>EMPLOYEE SUMMARY</strong>
        <p>Employee Name  :{{}}</p>
        <p>Employee I'd   :{{AZ002}}</p>
        <p>Pay PERIOD     :{{june 2023}}</p>
        <p>Pay Date       :{{01/06/2023}}</p>
    </div><br>
    <p>Designation : {{xxxxxxxxxxx}}</p><br>

    <table class="employee-table">
        <thead>
            <tr>
                <th>Earnings</th>
                <th>Amount</th>
                <th>Deductions</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Basic (30%)</td>
                <td>{{25,000.00}}</td>
                <td>Leave deduction (08)</td>
                <td>{{200.00}}</td>
            </tr>
            <tr>
                <td>House Rent Allowance (25%)</td>
                <td>{{7,000.00}}</td>
            </tr>
            <tr>
                <td>Other Allowance (25%)</td>
                <td>{{10,000.00}}</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Medical and Transport (20%)</td>
                <td>{{10,000.00}}</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Gross Earnings (20%)</td>
                <td>{{32,000.00}}</td>
                <td>Total deduction</td>
                <td>{{2000.00}}</td>
            </tr>
            <tr>
                <td><strong>TOTAL NET PAYABLE</strong>
                    <p>Gross Earning - Total Deduction</p>
                </td>
                <td></td>
                <td></td>
                <td>
                    {{30,000.00}}
                </td>
            </tr>
        </tbody>
    </table>
</div>
</body>
</html>
`;

pdf.create(htmlContent).toFile('salary_structure.pdf', (err, res) => {
    if (err) {
        console.error('Error generating PDF:', err);
    } else {
        console.log('PDF generated successfully:', res.filename);
    }
});


}







