const express = require('express');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const checkImage = require('../middleware/checkImage');
const validate = require('../middleware/validate');
const v = require('../validators/employee.validators');
const ctrl = require('../controllers/employee.controller');

const router = express.Router();

// ORDER MATTERS: /search must stay above /:eid
router.get('/employees/search', auth, v.searchRules, validate, ctrl.search);
router.get('/employees', auth, ctrl.list);
router.post('/employees', auth, upload, checkImage, v.createRules, validate, ctrl.create);
router.get('/employees/:eid', auth, v.eidParamRules, validate, ctrl.getOne);
router.put('/employees/:eid', auth, v.eidParamRules, validate, upload, checkImage, v.updateRules, validate, ctrl.update);
router.delete('/employees', auth, v.eidQueryRules, validate, ctrl.remove);

module.exports = router;