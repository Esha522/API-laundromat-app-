const Card = require('../Models/cardmodel');
const WalletTransaction = require('../Models/transactionmodel');
const User = require ('../Models/usermodel');

// get wallet detail of user
exports.getWalletInfo = async (req, res) => {
  try {
    const userId  = req.params.userId ;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const card = await Card.find({ userId: userId  });

    const transactions = await WalletTransaction.find({ user: userId  }).sort({ createdAt: -1 });

    const balance = transactions.reduce((acc, txn) => {
      return txn.type === 'credit' ? acc + txn.amount : acc - txn.amount;
    }, 0);

    res.json({
      userId: user._id,
      balance,
      card,
      transactions
    });

  } catch (err) {
    console.error("Error fetching wallet info:", err);
    res.status(500).json({ message: "Server error fetching wallet info" });
  }
};



//add card

exports.addCard = async (req, res) => {
  try {
    const { userId, cardNumber, expiryMonth, expiryYear, cardType, cardHolderName } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const maskedCardNumber = cardNumber.slice(-4);

    const card = await Card.create({
      userId: user._id,
      cardNumber: maskedCardNumber,
      expiryMonth,
      expiryYear,
      cardType,
      cardHolderName,
    });

    res.status(201).json({ message: 'Card saved successfully', card });
  } catch (err) {
    console.error('Error saving card:', err);
    res.status(500).json({ message: 'Failed to save card' });
  }
};

// update card

exports.updateCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { expiryMonth, expiryYear, cardType, cardHolderName } = req.body;

    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      {
        ...(expiryMonth && { expiryMonth }),
        ...(expiryYear && { expiryYear }),
        ...(cardType && { cardType }),
        ...(cardHolderName && { cardHolderName }),
      },
      { new: true } 
    );

    if (!updatedCard) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.status(200).json({ message: 'Card updated successfully', card: updatedCard });
  } catch (err) {
    console.error('Error updating card:', err);
    res.status(500).json({ message: 'Failed to update card' });
  }
};


//topup wallet
exports.topUpWallet = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create credit transaction
    const transaction = await WalletTransaction.create({
      user: userId,
      amount,
      type: 'credit',
    });

    res.status(201).json({ message: 'Wallet topped up successfully', transaction });
  } catch (err) {
    console.error("Top-up error:", err);
    res.status(500).json({ message: "Failed to top up wallet" });
  }
};

// get wallet transactions 
exports.getWalletTransactions = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const transactions = await WalletTransaction.find({ user: userId })
      .sort({ createdAt: -1 });

    res.json({ transactions });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ message: "Server error fetching transactions" });
  }
};