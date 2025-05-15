const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { xeroCallback } = require('./controllers/xero.auth.controller');
dotenv.config()

const PORT = process.env.PORT

connectDB()

app.use(express.json())

app.use('/api/v1', require('./routes/xeroRoutes'));

app.use('/', (req, res) => {
  res.status(200).send("Api is runnnnnnnnnning...")
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Visit http://localhost:${PORT}/api/v1/auth to start`);
});

