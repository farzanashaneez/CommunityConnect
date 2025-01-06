// src/application/usecases/chatUseCase.ts

import { Chat, Message } from "../../domain/entities/Chat";
import { ChatRepository } from "../interfaces/ChatRepository";

export class ChatUseCase {
  constructor(private chatRepository: ChatRepository) {}

  async createChat(data: object,type:string): Promise<Chat> {
    return this.chatRepository.createChat(data,type);
  }

  async getChatById(id: string): Promise<Chat | null> {
    return this.chatRepository.getChatById(id);
  }

  async addMessage(chatId: string, senderId: string, content: string): Promise<Chat> {
    const message: Partial<Message> = {
      senderId,
      content,
      createdAt: new Date()
    };
    return this.chatRepository.addMessage(chatId, message);
  }

  async getChatsForUser(userId: string,query:string): Promise<Chat[]> {
    return this.chatRepository.getChatsForUser(userId,query);
  }

  async deleteChat(id: string): Promise<void> {
    return this.chatRepository.deleteChat(id);
  }
}
