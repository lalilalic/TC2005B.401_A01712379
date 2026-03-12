const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users.controller');
const isAuth = require('../util/is-auth');
const canAdmin = require('../util/can-admin');

router.get('/info', usersController.get_info);
router.get('/login', usersController.get_login);
router.post('/login', usersController.post_login);
router.get('/logout', usersController.get_logout);
router.get('/signup', usersController.get_signup);
router.post('/signup', usersController.post_signup);
router.get('/rbac', isAuth, canAdmin, usersController.get_rbac);
router.post('/rbac/asignar-rol', isAuth, canAdmin, usersController.post_asignar_rol);
router.post('/rbac/asignar-privilegio', isAuth, canAdmin, usersController.post_asignar_privilegio);

module.exports = router;
