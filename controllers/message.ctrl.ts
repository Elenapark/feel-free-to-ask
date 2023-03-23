import BadRequestError from './error/bad_request_error';
import { NextApiRequest, NextApiResponse } from 'next';
import MessageModel from '@/models/message/message.model';

async function add(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: { uid, message, author },
  } = req;

  if (uid === null || uid === undefined) {
    throw new BadRequestError('uid가 누락되었습니다.');
  }
  if (message === null || message === undefined) {
    throw new BadRequestError('message가 누락되었습니다.');
  }

  await MessageModel.addMessage({
    uid,
    message,
    author,
  });

  return res.status(201).end();
}

const MessageController = {
  add,
};

export default MessageController;
