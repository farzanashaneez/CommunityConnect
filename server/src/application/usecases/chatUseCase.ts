// src/application/usecases/chatUseCase.ts

import { Chat, Message } from "../../domain/entities/chats/Chat";
import { ChatRepository } from "../interfaces/ChatRepository";

export class ChatUseCase {
  constructor(private chatRepository: ChatRepository) {}

  async createChat(data: object,type:string): Promise<Chat | null> {
    return this.chatRepository.createChat(data,type);
  }

  async getChatById(id: string): Promise<Chat | null> {
    return this.chatRepository.getChatById(id);
  }

  async addMessage(chatId: string, senderId: string, content: string,status:"sending" | "sent" | "delivered" | "read" ): Promise<Message> {
    const message: Partial<Message> = {
      senderId,
      content,
      status:'sent',
      createdAt: new Date()
    };
    return this.chatRepository.addMessage(chatId, message);
  }
async updateMessageStatus(messageids:string[],status:string):Promise<any>{
  return this.chatRepository.updateMessageStatus(messageids,status);
}
  async getChatsForUser(userId: string,query:string): Promise<Chat[]> {
    return this.chatRepository.getChatsForUser(userId,query);
  }

  async deleteChat(id: string): Promise<void> {
    return this.chatRepository.deleteChat(id);
  }
}
