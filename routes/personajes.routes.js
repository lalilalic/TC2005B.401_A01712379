const express = require('express');
const router = express.Router();

const personajesController = require('../controllers/personajes.controller');

router.get('/new', personajesController.get_add);
router.get('/add', personajesController.get_add);
router.get('/nuevo', personajesController.get_add);
router.post('/new', personajesController.post_add);
router.get('/edit/:personaje_id', personajesController.get_edit);
router.post('/edit', personajesController.post_edit);
router.get('/old', personajesController.get_old);
router.use('/:personaje_id', personajesController.get_list);
router.use(personajesController.get_list);

module.exports = router;
