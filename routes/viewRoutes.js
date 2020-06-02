const express = require('express');
const {
  getOverview,
  getTour,
  getLoginForm,
  updateUserData,
  getAccount,
  getMyTours,
} = require('../controllers/viewController');
const { isLoggedIn, protect } = require('../controllers/authController');
const {} = require('../controllers/bookingController');

const router = express.Router();

router.use(alerts);

// The rout that will be hit once the credit card is successfully charged, BUT with a query to pass info
// ...see bookingController.js --> getCheckoutSession --> .success_url config of stripe
// And when it is hit with the query pre-defined, a booking entry will be added to DB
router.get('/', isLoggedIn, getOverview);
router.get('/login', isLoggedIn, getLoginForm);
router.get('/tour/:tourSlug', isLoggedIn, getTour);
router.get('/me', protect, getAccount);
router.get('/my-tours', protect, getMyTours);

router.post('/submit-user-data', protect, updateUserData);

module.exports = router;
