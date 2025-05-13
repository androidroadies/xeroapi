const { errorHandler } = require("../utils/errorHandler");
const { getValidXeroClient } = require("../utils/xeroClientHelper");

exports.createItems = async (req, res) => {
  try {
    const { xero, tenantId } = await getValidXeroClient();
    const { code } = req.body;

    const existingItems = await xero.accountingApi.getItems(tenantId, null, `Code=="${code}"`);

    if (existingItems.body.items.length > 0) {
      return res.status(409).json({
        message: 'Item already exist'
      });
    }

    const response = await xero.accountingApi.createItems(tenantId, { items: [req.body] });
    if (response.body && response.body.items) {
      res.status(201).json({
        message: 'Item created successfully',
        data: response.body
      });
    } else {
      res.status(400).json({ message: 'Failed to create item', error: 'No item returned' });
    }
  } catch (error) {
    errorHandler(res, error)
  }
};

exports.deleteItems = async (req, res) => {
  try {
    const { xero, tenantId } = await getValidXeroClient();
    const { itemId } = req.params;
    if (!itemId) {
      throw new Error('Item ID is required for deletion');
    }
    console.log(`Attempting to delete item with ID: ${itemId} from tenant: ${tenantId}`);

    const response = await xero.accountingApi.deleteItem(tenantId, itemId);
    if (response.response.status === 204) {
      return res.status(200).json({
        message: 'Item deleted successfully',
      });
    }

    console.log('Unexpected response:', response);

    throw new Error('Failed to delete item');
  } catch (error) {
    console.error('Error in deleteItems:', error);
    errorHandler(res, error);
  }
};

exports.getItems = async (req, res) => {
  try {
    const { xero, tenantId } = await getValidXeroClient();
    const response = await xero.accountingApi.getItems(tenantId);
    console.log("xero.item.controller.js", 44, "- response.response ->", response.response.data.Items);
    if (response.response && response.response.data.Items) {
      const items = response.response.data.Items;
      res.status(200).json({
        message: "Contacts listed successfully",
        data: items,
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

exports.putItems = async (req, res) => {
  try {
    const { xero, tenantId } = await getValidXeroClient();
    const { itemId } = req.params;
    const updatedItem = req.body;
    const response = await xero.accountingApi.updateItem(tenantId, itemId, { items: [updatedItem] });

    // Validate response
    if (!response?.body?.items?.[0]) {
      return res.status(500).json({
        message: 'Unexpected response from Xero API: No item data returned',
      });
    }
    res.status(200).json({
      message: 'Item updated successfully',
      data: response.body.items[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};