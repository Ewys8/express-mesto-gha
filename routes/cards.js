const router = require('express').Router();
const {
  createCard, getCards, deleteCard, addLike, deleteLike,
} = require('../controllers/cards');

router.post('/', createCard);
router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', addLike);
router.delete('/:cardId/likes', deleteLike);

module.exports = router;
