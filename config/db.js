   // db.js
   const knex = require("knex");
   const dotenv = require('dotenv').config();
   
   const db = knex({
     client: "mssql", // Change the client to MSSQL
     connection: {
       // host: "your-mssql-server-host", // Change this to your MSSQL server host
       server: process.env.Server,
       user: process.env.User, 
       password: process.env.Password, 
       port: 1433,
       database: process.env.Database,
       options: {
         encrypt: false, // Set to true if using encryption (for secure connections)
       //   trustServerCertificate: true,
       },
     },
   });
   
   module.exports = db;
   