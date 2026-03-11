const express = require('express');
const router = express.Router();

const isAuth = require('../util/is-auth');
const personajesController = require('../controllers/personajes.controller');

router.get('/new', isAuth, personajesController.get_add);
router.get('/add', isAuth, personajesController.get_add);
router.get('/nuevo', isAuth, personajesController.get_add);
router.post('/new', isAuth, personajesController.post_add);
router.get('/old', isAuth, personajesController.get_old);
router.use('/:personaje_id', isAuth, personajesController.get_list);
router.use(isAuth, personajesController.get_list);

module.exports = router;