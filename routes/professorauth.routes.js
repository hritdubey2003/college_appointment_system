import express from 'express';
import { deleteTimeSlot, registerProfessor, setAvailability } from '../controller/professorauth.controller.js';
import { loginProfessor } from '../controller/professorauth.controller.js';
import { logoutProfessor } from '../controller/professorauth.controller.js';
import { professorAuth  } from '../middleware/professorauth.middleware.js';
const router = express.Router();

router.post('/register' , registerProfessor );
router.post('/login' , loginProfessor );
router.get('/logout' , professorAuth , logoutProfessor );
router.post('/setavailability' , professorAuth , setAvailability );
router.post('/deletetimeslot' , professorAuth , deleteTimeSlot );

export default router;