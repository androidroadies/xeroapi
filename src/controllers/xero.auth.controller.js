const { xero } = require("../config/xero.config");

const xeroAuth = async (req, res) => {
  const consentUrl = xero.buildConsentUrl({
    redirectUri: process.env.XERO_REDIRECT_URI,
  });

  res.redirect(consentUrl);
}

module.exports = {
  xeroAuth
};