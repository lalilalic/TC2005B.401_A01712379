const express = require('express');
const router = express.Router();
const isAuth = require('../util/is-auth');
const canCreate = require('../util/can-create');
const canView = require('../util/can-view');
const destinosController = require('../controllers/destinos.controllers');

// Ruta para buscar destinos de forma asíncrona
router.get('/buscar/:busqueda', isAuth, canView, destinosController.get_buscar);
router.get('/new', isAuth, canCreate, destinosController.get_add);
router.get('/add', isAuth, canCreate, destinosController.get_add);
router.get('/nuevo', isAuth, canCreate, destinosController.get_add);
router.post('/new', isAuth, canCreate, destinosController.post_add);
router.get('/:destino_id/edit', isAuth, canCreate, destinosController.get_edit);
router.post('/edit', isAuth, canCreate, destinosController.post_edit);
router.use('/:destino_id', isAuth, canView, destinosController.get_list);
router.use(isAuth, canView, destinosController.get_list);



module.exports = router;
