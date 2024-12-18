// src/infrastructure/web/routes/chatRoutes.ts

import express from 'express';
import { MongoChatRepository } from '../../infrastructure/database/MongoChatRepository';
import { ChatUseCase } from '../../application/usecases/chatUseCase';
import { ChatController } from '../controllers/ChatController';

const router = express.Router();

// Initialize dependencies
const chatRepository = new MongoChatRepository();
const chatUseCase = new ChatUseCase(chatRepository);
const chatController = new ChatController(chatUseCase);

// Define routes
router.post('/:type', (req, res, next) => chatController.createChat(req, res, next));
router.get('/:id', (req, res, next) => chatController.getChatById(req, res, next));
router.post('/:id/message', (req, res, next) => chatController.addMessage(req, res, next));
router.get('/user/:userId', (req, res, next) => chatController.getChatsForUser(req, res, next));
router.delete('/:id', (req, res, next) => chatController.deleteChat(req, res, next));

export default router;
