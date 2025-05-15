const { xero } = require("../config/xero.config");
const { saveTokenSet } = require("./xeroController");

const xeroAuth = async (req, res) => {
  const consentUrl = await xero.buildConsentUrl();
  res.redirect(consentUrl);
}

const xeroCallback = async (req, res) => {
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
}

module.exports = {
  xeroAuth,
  xeroCallback
};