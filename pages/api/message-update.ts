import checkSupportedMethod from '@/controllers/error/check_supported_method';
import handleError from '@/controllers/error/handle_error';
import { NextApiRequest, NextApiResponse } from 'next';
import MessageController from '@/controllers/message.ctrl';
import { Message } from '@/models/types/message_contents';

type Data = Message & { isDenided: boolean };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;
  const supportedMethods = ['PUT'];

  try {
    checkSupportedMethod(supportedMethods, method!);
    await MessageController.update(req, res);
  } catch (err) {
    console.error(err);
    handleError(err, res);
  }
}
