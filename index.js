// index.js
const cluster = require('cluster');

const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    // Restart the worker
    cluster.fork();
  });
} else {
  // Worker process logic remains the same
const PORT = 3001
const express = require("express");
const path = require('path');
const app = express();

const cors = require('cors');

// const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const rootRoutes = require('./Routes/indexRoutes.js');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/PMS', rootRoutes);






app.listen(process.env.PORT || 3001, () => { console.log(`Server listening to ${PORT} and running`);});

}

