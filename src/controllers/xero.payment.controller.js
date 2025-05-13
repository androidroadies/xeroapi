const { getValidXeroClient } = require("../utils/xeroClientHelper");

exports.createPayment = async (req, res) => {
  try {
    const { xero, tenantId } = await getValidXeroClient();
    let paymentsInput = req.body;

    // Normalize to array if it's a single object
    if (!Array.isArray(paymentsInput)) {
      paymentsInput = [paymentsInput];
    }

    const createdPayments = [];

    for (const payment of paymentsInput) {
      const response = await xero.accountingApi.createPayment(tenantId, payment);
      createdPayments.push(response.body.payments?.[0]);
    }

    res.status(200).json({
      message: `${createdPayments.length} payment(s) recorded successfully`,
      data: createdPayments,
    });

  } catch (error) {
    console.error("xero.payment.controller.js", 15, "-  ->", error);
    console.error("Error creating payment:", error?.response?.body || error.message);
    res.status(500).json({ message: "Error creating payment", error: error?.response?.body || error.message });
  }
};

exports.getPayment = async (req, res) => {
  try {
    const { xero, tenantId } = await getValidXeroClient();
    const response = await xero.accountingApi.getPayments(tenantId);
    res.status(200).json({
      message: "Payment recorded listed",
      data: response.body.payments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Somthing went wrong!!...' });
  }
};