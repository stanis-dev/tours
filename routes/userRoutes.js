const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  getUser,
  patchUser,
  deleteUser,
} = require('../controllers/userController');

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(patchUser).delete(deleteUser);

module.exports = router;
