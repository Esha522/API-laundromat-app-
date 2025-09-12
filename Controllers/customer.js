const Customer = require('../Models/customermodel');
const User  = require ('../Models/usermodel');
const moment = require ('moment');

// View all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
    .select('customerId name phonenumber email gender address status'); 
        const today = moment().startOf('day').toDate();
    
    const newRegistrations = await User.countDocuments({ createdAt: { $gte: today } });
    const activeCustomers = await Customer.countDocuments({ status: 'Active' });
    const InactiveCustomers = await Customer.countDocuments    ({ status: 'Inactive' });

    res.status(200).json({
      customers,
      metrics: {
        newRegistrations,
        activeCustomers,
        InactiveCustomers
      },
    });


  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Failed to fetch customers' });
  }
};


// get customer by id 
exports.getCustomerById = async (req, res) => {
  try {
 const customerId = req.params.customerId;

    const customer = await Customer.findOne({ customerId });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found'});
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error('Get customer by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching customer' });
  }
};


//add customer
exports.createCustomer = async (req, res) => {
  try {
    const {
      name,
      phonenumber,
      email,
      gender,
      dateOfBirth,
      deliveryMood,
      address,
      city,
      postalCode,
      customerType,
      status,
      registeredBy,
      registeredOn
    } = req.body;

    const existingCustomer = await Customer.findOne({
      $or: [{ email }, { phonenumber }]
    });

    if (existingCustomer) {
      return res.status(400).json({ message: 'Email or phone number already exists' });
    }

    const lastCustomer = await Customer.findOne().sort({ createdAt: -1 });
    let newId = 'CUST001';

    if (lastCustomer && lastCustomer.customerId) {
      const lastIdNum = parseInt(lastCustomer.customerId.replace('CUST', ''), 10);
      const nextIdNum = lastIdNum + 1;
      newId = 'CUST' + nextIdNum.toString().padStart(3, '0');
    }

    const newCustomer = new Customer({
      customerId: newId,
      name,
      phonenumber,
      email,
      gender,
      dateOfBirth,
      deliveryMood,
      address,
      city,
      postalCode,
      customerType,
      status,
      registeredBy,
      registeredOn
    });

    await newCustomer.save();

    res.status(201).json({ message: 'Customer added successfully', customer: newCustomer });

  } catch (error) {
    console.error('Add customer error:', error);
    res.status(500).json({ message: 'Server error while adding customer' });
  }
};


// update customer
exports.updateCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const customer = await Customer.findOne({ customerId });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Update fields
    customer.name = req.body.name || customer.name;
    customer.phonenumber = req.body.phonenumber || customer.phonenumber;
    customer.email = req.body.email || customer.email;
    customer.gender = req.body.gender || customer.gender;
    customer.dateOfBirth = req.body.dateOfBirth || customer.dateOfBirth;
    customer.deliveryMood = req.body.deliveryMood || customer.deliveryMood; 
    customer.address = req.body.address || customer.address; 
    customer.city = req.body.city || customer.city; 
    customer.postalCode = req.body.postalCode || customer.postalCode; 
    customer.customerType = req.body.customerType || customer.customerType; 
    customer.status = req.body.status || customer.status; 
    customer.registeredBy = req.body.registeredBy || customer.registeredBy; 
    customer.registeredOn = req.body.registeredOn || customer.registeredOn;

    const updatedCustomer = await customer.save();
    res.json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order' });
  }
};


// delete customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const deletedCustomer = await Customer.findOneAndDelete({ customerId });

    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully', deletedCustomer });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ message: 'Failed to delete customer' });
  }
};