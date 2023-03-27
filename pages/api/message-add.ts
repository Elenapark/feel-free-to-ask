import handleError from '@/controllers/error/handle_error';
import checkSupportedMethod from '@/controllers/error/check_supported_method';
import MessageController from '@/controllers/message.ctrl';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const supportedMethod = ['POST'];

  try {
    checkSupportedMethod(supportedMethod, method!);
    await MessageController.add(req, res);
  } catch (err) {
    console.error(err);
    handleError(err, res);
  }
}
