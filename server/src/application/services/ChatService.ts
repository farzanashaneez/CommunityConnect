import { Message } from "../../domain/entities/chats/Chat";
import { MongoChatRepository } from "../../infrastructure/database/MongoChatRepository";

class ChatServices{
        private chatservice=new MongoChatRepository();

        async getChatbyparticipants(sender:string,receiver:string){
            return this.chatservice.findChatByParticipants(sender,receiver)
        }
        async createchat(data:any,type:string){
            return this.chatservice.createChat(data,'personal')
    }
    addMessage(chatId: string, message: Partial<Message>){
return this.chatservice.addMessage(chatId,message)
    }
}
export default new ChatServices();