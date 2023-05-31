const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.list);
router.post('/', userController.save);
router.get('/:id', userController.getById);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);
router.get('/name/:name', userController.getByName);
router.get('/city/:city', userController.getByCity);
router.get('/state/:state', userController.getByState);
router.get('/status/active', userController.getActive);
router.get('/status/inactive', userController.getInactive);

module.exports = router;
