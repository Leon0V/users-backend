const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../uploads/multerHandler');

router.get('/', userController.list);
router.post('/', userController.save);
router.get('/:code', userController.getByCode);
router.put('/:code', userController.update);
router.delete('/:code', userController.delete);
router.patch('/profpic/:code', upload.single('avatar'), userController.uploadImg);

module.exports = router;
