import checkSupportedMethod from '@/controllers/error/check_supported_method';
import handleError from '@/controllers/error/handle_error';
import { NextApiRequest, NextApiResponse } from 'next';
import MessageController from '@/controllers/message.ctrl';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const supportedMethods = ['POST'];

  try {
    checkSupportedMethod(supportedMethods, method!);
    await MessageController.reply(req, res);
  } catch (err) {
    console.error(err);
    handleError(err, res);
  }
}
