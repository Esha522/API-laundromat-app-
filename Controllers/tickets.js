const Ticket = require('../Models/ticketsmodel');
const User = require('../Models/usermodel');

// Submit a new ticket
exports.submitTicket = async (req, res) => {
  try {
    const { userId, email, phoneNumber, message } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const ticket = await Ticket.create({
      user: userId,
      email,
      phoneNumber,
      message
    });

    res.status(201).json({ message: "Ticket submitted successfully", ticket });
  } catch (err) {
    console.error("Error submitting ticket:", err);
    res.status(500).json({ message: "Server error submitting ticket" });
  }
};

// Get tickets for a user (optional filter by status)
exports.getTickets = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    const query = { user: userId };
    if (status) query.status = status;

    const tickets = await Ticket.find(query).sort({ createdAt: -1 });

    res.json({ tickets });
  } catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).json({ message: "Server error fetching tickets" });
  }
};
