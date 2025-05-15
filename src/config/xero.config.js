const XeroClient = require('xero-node').XeroClient;
const dotenv = require('dotenv');
dotenv.config()

const PORT = process.env.PORT;

const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID,
  clientSecret: process.env.XERO_CLIENT_SECRET,
  redirectUris: [process.env.XERO_REDIRECT_URI],
  scopes: [
    'openid',
    'email',
    'profile',
    'offline_access',
    'accounting.settings',
    'accounting.contacts',
    'accounting.transactions',
    'accounting.reports.read'
  ],
  state: 'returnPage=my-sweet-dashboard',
  httpTimeout: 3000,
  clockTolerance: 60});

module.exports = {
  xero
};