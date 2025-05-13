const XeroToken = require('../model/xeroTokenModel');
const { getValidXeroClient } = require('../utils/xeroClientHelper');

exports.saveTokenSet = async (tokenSet, tenantId) => {
  try {
    const tokenData = {
      access_token: tokenSet.access_token,
      refresh_token: tokenSet.refresh_token,
      id_token: tokenSet.id_token,
      expires_at: new Date(Date.now() + tokenSet.expires_in * 1000),
      scope: tokenSet.scope,
      token_type: tokenSet.token_type,
      tenantId,
    };

    // Optionally delete old tokens
    await XeroToken.deleteMany({});
    const savedToken = await XeroToken.create(tokenData);
    return savedToken;
  } catch (err) {
    console.error('Error saving Xero tokens:', err);
    throw err;
  }
};

exports.getLatestToken = async () => {
  return await XeroToken.findOne().sort({ createdAt: -1 });
};
