import express from 'express';
const router = express.Router();

import {registrar, 
  autenticar, 
  confirmar, 
  olvidePassword, 
  comprobarToken, 
  newpassword, 
  perfil} from '../controllers/usuarioController.js';

import checkAuth from "../middleware/checkAuth.js"

// creacion auth y confirmacion de users

router.post('/',registrar);
router.post('/login',autenticar);
router.get('/confirmar/:token',confirmar);
router.post('/olvide-password',olvidePassword);
router.get('/olvide-password/:token',comprobarToken);
router.post('/olvide-password/:token',newpassword);

router.get('/perfil', checkAuth, perfil)

export default router;