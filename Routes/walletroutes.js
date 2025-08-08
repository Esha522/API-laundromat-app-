const express = require('express');
const router = express.Router();
const {getWalletInfo, addCard, updateCard, topUpWallet, getWalletTransactions} = require ('../Controllers/wallet');

router.get('/:userId', getWalletInfo );
router.post('/addcard', addCard);
router.put('/update/:cardId', updateCard);
router.post ('/topup', topUpWallet);
router.get ('/wallettransaction/:userId', getWalletTransactions);

module.exports = router;