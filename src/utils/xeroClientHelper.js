const { xero } = require('../config/xero.config');
const XeroToken = require('../model/xeroTokenModel');
require('dotenv').config();

const getValidXeroClient = async () => {
  const tokenData = await XeroToken.findOne().sort({ createdAt: -1 });
  if (!tokenData) throw new Error('No token found in database');

  const tokenSet = {
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    id_token: tokenData.id_token,
    expires_at: tokenData.expires_at.getTime(), // Make sure expires_at is in milliseconds
    scope: tokenData.scope,
    token_type: tokenData.token_type,
  };

  await xero.setTokenSet(tokenSet);
  await xero.updateTenants();

  const now = Date.now();
  const isExpired = tokenSet.expires_at <= now;
  if (isExpired) {
    console.log("Token expired, refreshing...");
    const newTokenSet = await xero.refreshToken();
    const tenantId = xero.tenants[0].tenantId;

    // Save new tokens to DB
    tokenData.access_token = newTokenSet.access_token;
    tokenData.refresh_token = newTokenSet.refresh_token;
    tokenData.id_token = newTokenSet.id_token;
    tokenData.expires_at = new Date(Date.now() + newTokenSet.expires_in * 1000);
    tokenData.scope = newTokenSet.scope;
    tokenData.token_type = newTokenSet.token_type;
    tokenData.tenantId = tenantId;

    await tokenData.save();
    console.log("xeroClientHelper.js", 50, "- Token updated in DB.");
  }

  const activeTenantId = xero.tenants[0].tenantId;
  return { xero, tenantId: activeTenantId };
};

module.exports = { getValidXeroClient };