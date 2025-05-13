const mongoose = require('mongoose');

const xeroTokenSchema = new mongoose.Schema({
  access_token: String,
  refresh_token: String,
  id_token: String,
  expires_at: Date,
  scope: String,
  token_type: String,
  tenantId: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('XeroToken', xeroTokenSchema);
