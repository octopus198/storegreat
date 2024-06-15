import CustomerModel from "../models/customer.model.js";

class CustomerService {
  async createCustomer(customerData) {
    const customer = await CustomerModel.create(customerData);
    return customer;
  }

  async getCustomers(userID) {
    const customers = await CustomerModel.find({ userID });
    return customers;
  }

  async getCustomerDetail(userID, customerID) {
    const customerDetail = await CustomerModel.findOne({
      userID,
      _id: customerID,
    });
    console.log(customerDetail);
    return customerDetail;
  }

  async updateCustomerDetail(userID, customerID, updatedData) {
    const existingCustomer = await CustomerModel.findOne({
      userID,
      _id: customerID,
    });
    if (Object.keys(updatedData).length === 0) {
      return existingCustomer;
    }
    Object.assign(existingCustomer, updatedData);
    const updatedCustomer = await existingCustomer.save();

    return updatedCustomer;
  }

  async deleteCustomer(userID, customerID) {
    const customer = await CustomerModel.findOne({ userID, _id: customerID });
    if (!customer) {
      throw new Error("Customer not found");
    }
    customer.deletedAt = new Date();
    await customer.save();
    return customer;
  }
}

const customerService = new CustomerService();
export default customerService;
