import { ReplyProps } from '@/models/message/message.model';
import { Message } from '@/models/types/message_contents';
import axios, { AxiosResponse } from 'axios';

/** message 관련 api */

export const getSingleMessage = async ({
  uid,
  messageId,
}: Omit<ReplyProps, 'reply'>): Promise<AxiosResponse<Message>> => {
  return await axios(`/api/message-each?uid=${uid}&messageId=${messageId}`);
};

export const getAllMessages = async (
  uid: string
): Promise<AxiosResponse<Message[]>> => {
  return await axios(`/api/message-list?uid=${uid}`);
};

export const addReplyToMessage = async ({
  uid,
  reply,
  messageId,
}: ReplyProps): Promise<AxiosResponse<void>> => {
  return await axios({
    method: 'POST',
    url: '/api/message-add-reply',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      uid,
      reply,
      messageId,
    },
  });
};
