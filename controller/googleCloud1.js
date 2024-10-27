const XLSX = require('xlsx');
const { google } = require('googleapis');
const fs = require('fs');
// const knex = require('knex')



const SCOPES = ['https://www.googleapis.com/auth/drive'];

exports. readFromCloud=async(req, res)=> {
    const fileId = req.params.fileId;
    try {
        const content = await readFile(fileId);
        console.log('content to show',content);
        res.send(content);
    } catch (error) {
        console.error('Error reading file:', error);
        res.status(500).send('Error reading file from Google Drive.');
    }
}


async function authenticate() {
    const credentials = require('../googleKeys/google1.json');

    const auth = new google.auth.GoogleAuth({
        credentials: credentials,
        scopes: SCOPES,
    });

    const drive = google.drive({ version: 'v3', auth });
    return drive;
}


async function readFile(fileId) {
    const drive = await authenticate();
    const response = await drive.files.get({
        fileId: fileId,
        alt: 'media',
    });
    console.log('Response:', response.data); // Log response data
    // // fs.writeFileSync('spreadsheet.xlsx', response.data);
    // // Convert the Blob object to a Buffer
    // const buffer = Buffer.from(await response.data.arrayBuffer());
    // fs.writeFileSync('spreadsheet.xlsx', buffer);
    // // return response.data;
    // return 'File downloaded successfully';

    // without downloading file 
     // Convert the Blob object to a Buffer
     const buffer = await response.data.arrayBuffer();

     // Parse the buffer using xlsx library
     const workbook = XLSX.read(Buffer.from(buffer), { type: 'buffer' });
 
     // Process the workbook as needed
     // For example, you can extract data from sheets:
     const sheetName = workbook.SheetNames[0];
     const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
 
     return sheetData;
}

