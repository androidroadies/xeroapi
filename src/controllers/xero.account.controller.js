const { getValidXeroClient } = require("../utils/xeroClientHelper");

exports.getAccounts = async (req, res) => {
  try {
    const { xero, tenantId } = await getValidXeroClient();
    const response = await xero.accountingApi.getAccounts(tenantId);
    res.status(200).json({
      message: 'Accounts fetched successfully',
      data: response.body.accounts
    });
  } catch (error) {
    console.error('Failed to fetch accounts:', error);
    res.status(500).json({
      message: 'Failed to fetch accounts',
      error: error.message
    });
  }
};

exports.createAccounts = async (req, res) => {
  try {
    const { xero, tenantId } = await getValidXeroClient();
    const response = await xero.accountingApi.createAccount(tenantId, { accounts: [req.body] });
    res.status(201).json({
      message: 'Accounts Created',
      data: response.body.accounts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Somthing went wrong!!...', data: JSON.parse(error) });
  }
};