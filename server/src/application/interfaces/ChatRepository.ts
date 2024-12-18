// src/application/interfaces/ChatRepository.ts

import { Chat, Message } from "../../domain/entities/Chat";

export interface ChatRepository {
  createChat(data:object,type:string): Promise<Chat>;
  getChatById(id: string): Promise<Chat | null>;
  addMessage(chatId: string, message: Partial<Message>): Promise<Chat>;
  getChatsForUser(userId: string): Promise<Chat[]>;
  deleteChat(id: string): Promise<void>;
}
