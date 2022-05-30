import { RequestHandler } from "express";

import { Message } from "../models/message.model";

/**
 * Get messages
 */
export const getLast50Messages: RequestHandler = async (req, res, next) => {
  try {
    // Getting last 50 messages
    const messages = await Message.find().sort({ $natural: -1 }).limit(50);
    return res.json(messages);
  } catch (error) {
    next(error);
  }
};
