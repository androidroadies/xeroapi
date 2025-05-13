const { getValidXeroClient } = require("../utils/xeroClientHelper");

exports.createContact = async (req, res) => {
  try {
    const { xero, tenantId } = await getValidXeroClient();
    const response = await xero.accountingApi.createContacts(tenantId, { contacts: [req.body] });
    res.status(201).json({ message: 'Contact created', data: response.body.contacts[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create contact', error: error.message });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const { xero, tenantId } = await getValidXeroClient();

    const contactId = req.params.contactId;
    const updatedContactData = req.body;
    const response = await xero.accountingApi.updateContact(
      tenantId,
      contactId,
      { contacts: [updatedContactData] }
    );

    res.status(200).json({
      message: 'Contact updated',
      data: response.body.contacts[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to update contact',
      error: error.message
    });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const { xero, tenantId } = await getValidXeroClient();
    const response = await xero.accountingApi.getContacts(tenantId);
    console.log("xero.contact.controller.js", 44, "- response.response ->", response.response.data.Contacts);
    if (response.response && response.response.data.Contacts) {
      const contacts = response.response.data.Contacts;
      res.status(200).json({
        message: "Contacts listed successfully",
        data: contacts,
      });
    } else {
      res.status(404).json({
        message: "No contacts found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
