const express = require('express');
const app = express();
const dotenv = require('dotenv');
const fs = require('fs');
const connectDB = require('./config/db');
const { saveTokenSet } = require('./controllers/xeroController');
const { getValidXeroClient } = require('./utils/xeroClientHelper');
const { xero } = require('./config/xero.config');
dotenv.config()

const PORT = process.env.PORT

connectDB()

app.use(express.json())

app.get('/callback', async (req, res) => {
  try {
    const tokenSet = await xero.apiCallback(req.url);
    await xero.updateTenants();
    const activeTenant = xero.tenants[0];

    await saveTokenSet(tokenSet, activeTenant.tenantId);

    const response = await xero.accountingApi.getAccounts(activeTenant.tenantId);
    res.status(200).json({
      message: "Authentication successful. Xero accounts retrieved.",
      tenantId: activeTenant.tenantId,
      totalAccounts: response.body.accounts?.length || 0
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Authentication failed', error: error.message });
  }
});

app.use('/api/v1', require('./routes/xeroRoutes'));

app.use('/', (req, res) => {
  res.status(200).send("Api is runnnnnnnnnning...")
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Visit http://localhost:${PORT}/api/v1/auth to start`);
});

