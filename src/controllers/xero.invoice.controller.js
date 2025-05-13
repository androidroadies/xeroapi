const { getValidXeroClient } = require("../utils/xeroClientHelper");


exports.createInvoice = async (req, res) => {
  try {
    const { xero, tenantId } = await getValidXeroClient();
    const response = await xero.accountingApi.createInvoices(tenantId, {
      invoices: [req.body]
    })
    console.log("xero.invoice.controller.js", 10, "-  ->", response);
    if (response.response.status === 200) {
      return res.status(201).json({
        message: "Invoice Created Successfully",
        data: response.body.invoices[0]
      })
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const { xero, tenantId } = await getValidXeroClient();
    const { invoiceId } = req.params
    const response = await xero.accountingApi.updateInvoice(tenantId, invoiceId, {
      invoices: [req.body]
    })
    if (response.response.status === 200) {
      return res.status(201).json({
        message: "Invoice Created Successfully",
        data: response.body.invoices[0]
      })
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.getInvoice = async (req, res) => {
  try {
    const { xero, tenantId } = await getValidXeroClient();
    const { invoiceId } = req.params
    const response = await xero.accountingApi.getInvoices(tenantId)
    console.log("xero.invoice.controller.js", 48, "-  ->", response);
    if (response.response.status === 200) {
      return res.status(201).json({
        message: "Invoice Listed",
        data: response.body.invoices
      })
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};