import CustomServerError from './error/custom_server_error';
import BadRequestError from './error/bad_request_error';
import { NextApiRequest, NextApiResponse } from 'next';
import MessageModel from '@/models/message/message.model';
import FirebaseAdmin from '@/models/firebase_admin';

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

async function get(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { uid },
  } = req;

  if (uid === null || uid === undefined) {
    throw new BadRequestError('uid가 누락되었습니다.');
  }

  const uidParam = Array.isArray(uid) ? uid[0] : uid;

  const messages = await MessageModel.getMessages(uidParam);
  return res.status(200).json(messages);
}

async function reply(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: { uid, messageId, reply },
  } = req;

  if (uid === null || uid === undefined) {
    throw new BadRequestError('uid가 누락되었습니다.');
  }

  if (messageId === null || messageId === undefined) {
    throw new BadRequestError('messageId가 누락되었습니다.');
  }
  if (reply === null || reply === undefined) {
    throw new BadRequestError('reply가 누락되었습니다.');
  }

  await MessageModel.addReplyToMessage({ uid, messageId, reply });
  return res.status(201).end();
}

async function getEachMessage(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { uid, messageId },
  } = req;

  if (uid === null || uid === undefined) {
    throw new BadRequestError('uid가 누락되었습니다.');
  }

  if (messageId === null || messageId === undefined) {
    throw new BadRequestError('messageId가 누락되었습니다.');
  }

  const uidParam = Array.isArray(uid) ? uid[0] : uid;
  const messageIdParam = Array.isArray(messageId) ? messageId[0] : messageId;

  const eachMessage = await MessageModel.getEachMessage({
    uid: uidParam,
    messageId: messageIdParam,
  });
  return res.status(200).json(eachMessage);
}

async function update(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: { uid, messageId, isDenied },
  } = req;

  const token = req.headers.authorization;

  if (!token) {
    throw new CustomServerError({
      statusCode: 401,
      message: '권한이 없는 사용자입니다.',
    });
  }

  let tokenUid: null | string = null;

  try {
    const decoded = await FirebaseAdmin.getInstance().Auth.verifyIdToken(token);
    tokenUid = decoded.uid;
  } catch (err) {
    throw new BadRequestError('token에 문제가 있습니다.');
  }

  if (uid === null || uid === undefined) {
    throw new BadRequestError('uid가 누락되었습니다.');
  }

  if (uid !== tokenUid) {
    throw new CustomServerError({
      statusCode: 401,
      message: '권한이 없는 사용자입니다.',
    });
  }

  if (messageId === null || messageId === undefined) {
    throw new BadRequestError('messageId가 누락되었습니다.');
  }
  if (isDenied === null || isDenied === undefined) {
    throw new BadRequestError('isDenied가 누락되었습니다.');
  }

  const updatedResult = await MessageModel.updateMessage({
    uid,
    messageId,
    isDenied,
  });

  return res.status(200).json(updatedResult);
}

const MessageController = {
  add,
  get,
  reply,
  getEachMessage,
  update,
};

export default MessageController;
