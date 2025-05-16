const express = require('express');
const { createContact, updateContact, getContacts } = require('../controllers/xero.contact.controller');
const { createItems, deleteItems, getItems, putItems } = require('../controllers/xero.items.controller');
const { createInvoice, updateInvoice, getInvoice } = require('../controllers/xero.invoice.controller');
const { createPayment, getPayment } = require('../controllers/xero.payment.controller');
const { getAccounts, createAccounts } = require('../controllers/xero.account.controller');
const { xeroAuth, xeroCallback, xeroTokens } = require('../controllers/xero.auth.controller');
const router = express.Router();

router.get('/callback', xeroCallback);
router.get('/auth', xeroAuth);
router.post('/auth-tokens', xeroTokens);
router.get('/accounts', getAccounts);
router.put('/accounts', createAccounts);
router.get('/contacts', getContacts);
router.post('/contacts', createContact);
router.put('/contacts/:contactId', updateContact);
router.get('/items', getItems);
router.post('/items', createItems);
router.put('/items/:itemId', putItems);
router.delete('/items/:itemId', deleteItems);
router.get('/invoice', getInvoice);
router.post('/invoice', createInvoice);
router.put('/invoice/:invoiceId', updateInvoice);
router.get('/payment', getPayment);
router.post('/payment', createPayment);
router.put('/payment/:paymentId', updateInvoice);

module.exports = router;
