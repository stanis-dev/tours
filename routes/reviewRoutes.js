const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserIds,
  getReview,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

router
  .route('/')
  .get(getReviews)
  .post(protect, restrictTo('user'), setTourUserIds, createReview);

router.route('/:id').delete(deleteReview).patch(updateReview).get(getReview);

module.exports = router;
