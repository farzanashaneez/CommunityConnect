
import { Request, Response, NextFunction } from 'express';
import { ChatUseCase } from '../../application/usecases/chatUseCase';
import { getIO } from '../../infrastructure/services/socket';
import { updateMessageStatusSocket } from '../../infrastructure/services/socket/chatHandlers';
//import { getIO } from '../../infrastructure/services/socketIOServices';

export class ChatController {
  constructor(private chatUseCase: ChatUseCase) {}

  async createChat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {type}=req.params;
      console.log("creating new chat",type)

      const data= req.body;
      const newChat = await this.chatUseCase.createChat(data,type);
      res.status(201).json(newChat);
    } catch (error: any) {
      res.status(400).json({ message: 'Error creating chat', error: error?.message });
    }
  }

  async getChatById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const chat = await this.chatUseCase.getChatById(id);
      if (chat) {
        res.json(chat);
      } else {
        res.status(404).json({ message: 'Chat not found' });
      }
    } catch (error: any) {
      res.status(400).json({ message: 'Error fetching chat', error: error?.message });
    }
  }

  async addMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { senderId, content,status } = req.body;
      const newmessage = await this.chatUseCase.addMessage(id, senderId, content,status);

    

      res.json(newmessage);
    } catch (error: any) {
      res.status(400).json({ message: 'Error adding message', error: error?.message });
    }
  }

  async updateMessageStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { messageIds, status }:{messageIds:[],status:string} = req.body;
      const chatId=req.params.chatid;

      const newmessage = await this.chatUseCase.updateMessageStatus(messageIds,status);

     
    updateMessageStatusSocket(chatId,messageIds)
    console.log('backend called',chatId,messageIds,newmessage,status) 
    // try {
    //   const io = getIO();
    //   io.emit('statusUpdatedFromFrontent', {
    //     chatid: chatId,
    //     unreadMessageIds: messageIds,
    //     from: false,
    //   });
    // } catch (error) {
    //   console.error('Error emitting event:', error);
    // }

      res.json(newmessage);
    } catch (error: any) {
      res.status(400).json({ message: 'Error adding message', error: error?.message });
    }
  }

  async getChatsForUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId,query } = req.params;

      const chats = await this.chatUseCase.getChatsForUser(userId,query);

      res.json(chats);
    } catch (error: any) {
      res.status(400).json({ message: 'Error fetching chats', error: error?.message });
    }
  }

  async deleteChat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.chatUseCase.deleteChat(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: 'Error deleting chat', error: error?.message });
    }
  }
}
