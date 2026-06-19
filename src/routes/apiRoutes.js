import express from 'express';
import { getHelloMessage, getAllIsWellMessage } from '../controllers/messageController.js';

const router = express.Router();

router.get('/api/hello', getHelloMessage);
router.get('/api/iswell', getAllIsWellMessage);

export default router;