// src/infrastructure/database/MongoChatRepository.ts

import mongoose, { Model, Schema } from "mongoose";
import { Chat, Message } from "../../domain/entities/chats/Chat";
import { ChatRepository } from "../../application/interfaces/ChatRepository";

const messageSchema = new Schema<Message>({
  senderId: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ["sending", "sent", "delivered", "read"] },
  createdAt: { type: Date, default: Date.now },
});

const chatSchema = new Schema<Chat>({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isgroup: { type: Boolean, default: false },
  groupName: { type: String },
  createdBy: { type: String },
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ChatModel = mongoose.model<Chat>("Chat", chatSchema);
const MessageModel = mongoose.model<Message>("Message", messageSchema);

export class MongoChatRepository implements ChatRepository {
  async createChat(
    data: {
      participants: string[];
      type: string;
      groupName: string;
      createdBy: string;
    },
    type: string
  ): Promise<Chat | null> {
    let newChat;
    const { participants, createdBy } = data;
    if (type === "group") {
      newChat = new ChatModel({
        participants,
        isgroup: true,
        groupName: data.groupName,
        createdBy,
      });
    } else {
      const { participants } = data;
      newChat = new ChatModel({
        participants,
        isgroup: false,
      });
    }

  const savedChat = await newChat.save();

  return ChatModel.findById(savedChat._id)
  .populate({
    path: "participants",
    select: "imageUrl firstName apartmentId email",
    populate: {
      path: "apartmentId", // Path to populate within participants
      select: "apartmentNumber buildingSection", // Fields to include from the Apartment model
    },
  })
    .populate({
      path: "messages",
      select: "senderId content status createdAt",
    })
    .exec();

  }

  async getChatById(id: string): Promise<Chat | null> {
    return ChatModel.findById(id)
      .populate({
        path: "messages",
        select: "senderId content status createdAt",
      })
      .exec();
  }
  async findChatByParticipants(sender:string,receiver:string):Promise<Chat | null> {
    return ChatModel.findOne({
      isgroup: false,
      participants: { $all: [sender, receiver] },
      $expr: { $eq: [{ $size: "$participants" }, 2] }
    })
    .populate({
      path: "participants",
      select: "imageUrl firstName apartmentId email",
      populate: {
        path: "apartmentId", // Path to populate within participants
        select: "apartmentNumber buildingSection", // Fields to include from the Apartment model
      },
    })
      .populate({
        path: "messages",
        select: "senderId content status createdAt",
      })
      .exec();
  }
  async addMessage(chatId: string, message: Partial<Message>): Promise<Message> {
    const newMessage = new MessageModel(message);
    const savedMessage = await newMessage.save();

    // Update the chat document with the new message ID
    const updatedChat = await ChatModel.findByIdAndUpdate(
      chatId,
      {
        $push: { messages: savedMessage._id },
        $set: { updatedAt: new Date() },
      },
      { new: true }
    ).exec();

    if (!updatedChat) {
      throw new Error("Chat not found");
    }
    return newMessage;
  }
async updateMessageStatus(messageids:string[],status:string):Promise<any>{
  return MessageModel.updateMany(
    { _id: { $in: messageids } },
    { $set: { status: status } },
    { new: true }
  );
}
  async getChatsForUser(userId: string, query: string): Promise<Chat[]> {
    return ChatModel.find({ participants: { $elemMatch: { $eq: userId } } })
      .populate({
        path: "participants",
        select: "imageUrl firstName apartmentId email mobileNumber",
        populate: {
          path: "apartmentId", // Path to populate within participants
          select: "apartmentNumber buildingSection", // Fields to include from the Apartment model
        },
      })
      .populate({
        path: "messages",
        select: "senderId content status createdAt",
        options: { sort: { createdAt: -1 }, limit: 1 }, // Fetch only the last message
      })
      .sort({updatedAt:-1})
      .exec();
  }

  async deleteChat(id: string): Promise<void> {
    const result = await ChatModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new Error("Chat not found");
    }
  }
}
