import express from 'express';
import { getAvailableTimeSlots, logoutStudent, registerStudent ,bookTimeSlot , cancelAppointment } from '../controller/studentauth.controller.js';
import { loginStudent } from '../controller/studentauth.controller.js';
import { studentAuth } from '../middleware/studentauth.middleware.js';

const router = express.Router();

router.post('/register' , registerStudent );
router.post('/login' , loginStudent );
router.get('/logout' , studentAuth , logoutStudent );
router.get('/getProfessorsList' , studentAuth , getAvailableTimeSlots );
router.post('/bookTimeSlot', studentAuth, bookTimeSlot);
router.post('/cancelAppointment', studentAuth, cancelAppointment);

export default router;
