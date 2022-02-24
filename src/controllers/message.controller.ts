import { RequestHandler } from "express";

import { Message } from "../models/message.model";

export const getMessages: RequestHandler = async (req, res, next) => {
  try {
    // Getting last 50 messages
    const messages = await Message.find().sort({ $natural: -1 }).limit(50);
    res.json(messages);
  } catch (error) {
    next(error);
  }
};
