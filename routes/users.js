const router = require('express').Router();
const {
  getUsers, getUserById, addUser, editUserData, updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', addUser);
router.patch('/me', editUserData);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
