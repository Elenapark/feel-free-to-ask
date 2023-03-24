import checkSupportedMethod from '@/controllers/error/check_supported_method';
import handleError from '@/controllers/error/handle_error';
import { MessageListProps } from './../../models/message/message.model';
import { NextApiRequest, NextApiResponse } from 'next';
import MessageController from '@/controllers/message.ctrl';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MessageListProps[]>
) {
  const { method } = req;
  const supportedMethods = ['GET'];

  try {
    checkSupportedMethod(supportedMethods, method!);
    await MessageController.get(req, res);
  } catch (err) {
    console.error(err);
    handleError(err, res);
  }
}
