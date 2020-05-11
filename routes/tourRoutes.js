const express = require('express');
const router = express.Router();
const {
  getAllTours,
  createTour,
  getTour,
  patchTour,
  deleteTour,
  checkID,
  checkBody,
} = require('../controllers/tourController');

router.param('id', checkID);

router.route('/').get(getAllTours).post(checkBody, createTour);
router.route('/:id').get(getTour).patch(patchTour).delete(deleteTour);

module.exports = router;
