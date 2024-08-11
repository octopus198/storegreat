import { CUSTOMER_MESSAGE } from "../constants/message.js";
import customerService from "../services/customer.service.js";

export const createCustomerController = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const customerData = { userID, ...req.body };
  
    const newCustomer = await customerService.createCustomer(customerData);
    return res.json({
      message: CUSTOMER_MESSAGE.CREATE_CUSTOMER_SUCCESS,
      customer: newCustomer,
    });
  } catch (err) {
    console.log(err);
    console.log("createCustomerController error");
    next(err);
  }
};

export const getCustomerController = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const customers = await customerService.getCustomers(userID);

    return res.json(customers);
  } catch (err) {
    throw new Error("Err getting customers", err);
  }
};

export const getCustomerDetailController = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const customerID = req.params.id;
    const customerDetail = await customerService.getCustomerDetail(
      userID,
      customerID
    );
    if (!customerDetail) {
      return res.status(404).json({
        error: "Customer not found",
      });
    }
    return res.json(customerDetail);
  } catch (err) {
    throw new Error("Err getting customer details", err);
  }
};

export const updateCustomerDetailController = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const customerID = req.params.id;
    const updatedData = req.body;

    const updatedCustomer = await customerService.updateCustomerDetail(
      userID,
      customerID,
      updatedData
    );
 
    if (!updatedCustomer) {
      return res.status(404).json({
        error: "Customer not found",
      });
    }
    return res.json(updatedCustomer);
  } catch (err) {
    throw new Error("Err updating customer details", err);
  }
};

export const deleteCustomerController = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const customerID = req.params.id;
    const deletedCustomer = await customerService.deleteCustomer(userID, customerID);
    res.json({
      message: "Customer deleted successfully",
      deletedCustomer: deletedCustomer
    });
  } catch (error) {
    throw new Error("Err deleting customer", error);
  }
}
