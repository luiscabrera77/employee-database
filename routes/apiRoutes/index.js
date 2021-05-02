const express = require('express');
const router = express.Router();

router.use(require('./departmentsRoutes.js'));
router.use(require('./rolesRoutes'));
router.use(require('./employeesRoutes'));
router.use(require('./budgetRoutes'));

module.exports = router;