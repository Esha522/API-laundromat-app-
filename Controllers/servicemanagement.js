const Service = require('../Models/servicemanagementmodel');

// Create a new service
exports.createService = async (req, res) => {
  try {
    const {
      serviceName,
      category,
      price,
      turnaroundTime,
      pricingType,
      estimatedWeightLimit,
      description,
      isActive
    } = req.body;

    const service = await Service.create({
      serviceName,
      category,
      price,
      turnaroundTime,
      pricingType,
      estimatedWeightLimit,
      description,
      isActive
    });

    res.status(201).json({ message: 'Service created successfully', service });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Server error while creating service' });
  }
};

// Optional: Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
    .select('orderId serviceName category price turnaroundTime isActive') ;
    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Server error while fetching services' });
  }
};


// delete service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await service.deleteOne();
    res.status(200).json({ message: 'Service deleted successfully' });

  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Server error while deleting service' });
  }
};
