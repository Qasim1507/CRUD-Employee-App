const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.get('/',customerController.homepage);
router.get('/add',customerController.addUser);
router.post('/add',customerController.postUser);
router.get('/view/:id',customerController.view);
router.get('/edit/:id',customerController.edit);
router.put('/edit/:id',customerController.editemp);
router.delete('/edit/:id', customerController.deleteUser);

module.exports = router;