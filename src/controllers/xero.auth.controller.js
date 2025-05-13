const { xero } = require("../config/xero.config");

const xeroAuth = async (req, res) => {
  const consentUrl = await xero.buildConsentUrl();
  res.redirect(consentUrl);
}

module.exports = {
  xeroAuth
};