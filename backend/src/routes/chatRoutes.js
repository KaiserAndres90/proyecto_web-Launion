import { Router } from 'express';
import { chatIA } from '../controllers/chatController.js';
const router = Router();
router.post('/', chatIA);
export default router;