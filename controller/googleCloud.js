// Import necessary libraries
const XLSX = require('xlsx');
const { google } = require('googleapis');
const db = require("../config/db")


const SCOPES = ['https://www.googleapis.com/auth/drive'];


// Define the authenticate function
async function authenticate() {
  const credentials = require('../googleKeys/google1.json');

  const auth = new google.auth.GoogleAuth({
    credentials: credentials,
    scopes: SCOPES, // Define SCOPES if not already defined
  });

  const drive = google.drive({ version: 'v3', auth });
  return drive;
}



// Function to read data from Google Sheets and save it to the database
exports.readFromCloudAndSave = async (req, res) => {
  // const fileId = req.params.fileId;
  const fileId = req.body.fileId;
  console.log('field details',fileId);

  try {
    // Authenticate with Google Drive API
    const drive = await authenticate();
    // Read the Google Sheets file and parse the data
    const sheetData = await readFile(fileId);
    // console.log('sheet data',sheetData);

    // Extract relevant data from the parsed data
    const relevantData = extractData(sheetData);
    console.log('relevant data',relevantData);

    // Save the extracted data to the database
    await saveToDatabase(relevantData);

    // Respond with success message
    res.status(200).send('Data saved successfully from Google Sheets to the database.readFromCloudAndSave');
  } catch (error) {
    console.error('Error reading or saving data:', error);
    res.status(500).send('Error reading or saving data from Google Sheets.');
  }
}

async function readFile(fileId) {
  // Authenticate with Google Drive API
  const drive = await authenticate();

  // Read the Google Sheets file and parse the data
  const response = await drive.files.get({ fileId, alt: 'media' });
  const buffer = await response.data.arrayBuffer();
  const workbook = XLSX.read(Buffer.from(buffer), { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  console.log('Sheet Data:', sheetData); // Log the entire sheet data for debugging

  return sheetData;
}

function extractData(sheetData) {
  const extractedData = sheetData.map((row, index) => {
    const SrNO = row['SrNO'] && !isNaN(parseInt(row['SrNO'])) ? parseInt(row['SrNO']) : index + 1;

    // Calculate gross earning
    const grossEarning = (
      parseFloat(row['Basic']) +
      parseFloat(row['House_Rent_Allowance']) +
      parseFloat(row['Other_Allowance']) +
      parseFloat(row['Medical_And_Transport'])
    );

    const extractedData = {
      SrNO: SrNO,
      EMPLOYEE_ID: isNaN(parseInt(row['Employee_Id'])) ? null : parseInt(row['Employee_Id']),
      EMPLOYEE_NAME: row['Employee_Name'],
      PAY_PERIOD: row['Pay_Period'],
      PAY_DATE: row['Pay_Date'],
      DESIGNATION: row['Designation'],
      BASIC: isNaN(parseFloat(row['Basic'])) ? null : parseFloat(row['Basic']),
      HOUSE_RENT_ALLOWANCES: isNaN(parseFloat(row['House_Rent_Allowance'])) ? null : parseFloat(row['House_Rent_Allowance']),
      OTHER_ALLOWANCES: isNaN(parseFloat(row['Other_Allowance'])) ? null : parseFloat(row['Other_Allowance']),
      MEDICAL_AND_TRANSPORT: isNaN(parseFloat(row['Medical_And_Transport'])) ? null : parseFloat(row['Medical_And_Transport']),
      TOTAL_DEDUCTION: isNaN(parseFloat(row['Total_Deduction'])) ? null : parseFloat(row['Total_Deduction']),
      TOTAL_NET_PAYABLE: isNaN(parseFloat(row['Total_Net_Payable'])) ? null : parseFloat(row['Total_Net_Payable']),
      GROSS_EARNING: grossEarning  // Add gross earning to the extracted data
    };

    // Log the extracted data for debugging
    console.log(`Extracted data from row ${index + 1}:`, extractedData);

    return extractedData;
  });

  console.log('Extracted Data:', extractedData); // Log the extracted data for debugging

  return extractedData;
}

async function saveToDatabase(data) {
  try {
    console.log('Data to be inserted:', data); // Log the data to be inserted

    // Insert the data into the database
    await db('employeeSalary').insert(data);

    console.log('Data inserted successfully.');
  } catch (error) {
    console.error('Error saving data to the database:', error); 
    // rethrow the error
    throw new Error('Error saving data to the database.'); 
  }
}

