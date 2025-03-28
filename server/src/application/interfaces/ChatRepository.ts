// src/application/interfaces/ChatRepository.ts

import { Chat, Message } from "../../domain/entities/chats/Chat";

export interface ChatRepository {
  createChat(data:object,type:string): Promise<Chat | null>;
  getChatById(id: string): Promise<Chat | null>;
  addMessage(chatId: string, message: Partial<Message>): Promise<Message>;
  updateMessageStatus(messageids:string[],staus:string):Promise<any>;
  getChatsForUser(userId: string,query:string): Promise<Chat[]>;
  deleteChat(id: string): Promise<void>;
  
}
