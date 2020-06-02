const express = require('express');
const {
  getOverview,
  getTour,
  getLoginForm,
  updateUserData,
  getAccount,
} = require('../controllers/viewController');
const { isLoggedIn, protect } = require('../controllers/authController');

const router = express.Router();

// The rout that will be hit once the credit card is successfully charged, BUT with a query to pass info
// ...see bookingController.js --> getCheckoutSession --> .success_url config of stripe
router.get('/', isLoggedIn, getOverview);
router.get('/login', isLoggedIn, getLoginForm);
router.get('/tour/:tourSlug', isLoggedIn, getTour);
router.get('/me', protect, getAccount);

router.post('/submit-user-data', protect, updateUserData);

module.exports = router;
