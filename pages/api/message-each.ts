import checkSupportedMethod from '@/controllers/error/check_supported_method';
import handleError from '@/controllers/error/handle_error';
import { NextApiRequest, NextApiResponse } from 'next';
import MessageController from '@/controllers/message.ctrl';
import { Message } from '@/models/types/message_contents';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Message>
) {
  const { method } = req;
  const supportedMethods = ['GET'];

  try {
    checkSupportedMethod(supportedMethods, method!);
    await MessageController.getEachMessage(req, res);
  } catch (err) {
    console.error(err);
    handleError(err, res);
  }
}
