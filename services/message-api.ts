import FirebaseClient from '@/models/firebase_client';
import { Message } from '@/models/types/message_contents';
import axios, { AxiosResponse } from 'axios';

/** message 관련 api */

export interface MessageProps {
  uid: string;
  messageId: string;
}

export const getSingleMessage = async ({
  uid,
  messageId,
}: MessageProps): Promise<AxiosResponse<Message>> => {
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
}: MessageProps & {
  reply: string;
}): Promise<AxiosResponse<void>> => {
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

export const updateMessage = async ({
  uid,
  messageId,
  isDenied,
}: MessageProps & { isDenied: boolean }) => {
  const token =
    await FirebaseClient.getInstance().Auth.currentUser?.getIdToken();

  return await axios({
    method: 'PUT',
    url: '/api/message-update',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    data: {
      uid,
      messageId,
      isDenied,
    },
  });
};
