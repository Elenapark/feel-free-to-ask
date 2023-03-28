import BadRequestError from '@/controllers/error/bad_request_error';
import CustomServerError from '@/controllers/error/custom_server_error';
import FirebaseAdmin from '@/models/firebase_admin';
import { firestore } from 'firebase-admin';
import { AuthUserProps } from '../types/auth_user';
import { Message, MessageFromServer } from '../types/message_contents';

const MEMBER_COLLECTION = 'members';
const MESSAGE_COLLECTION = 'messages';

export interface AddMessageProps {
  uid: string;
  message: string;
  author?: Pick<AuthUserProps, 'displayName' | 'photoURL'>;
}

export interface NewMessageProps {
  message: string;
  author?: Pick<AuthUserProps, 'displayName' | 'photoURL'>;
  createdAt: firestore.Timestamp;
}

export interface ReplyProps {
  uid: string;
  messageId: string;
  reply: string;
}

const FirestoreInstance = FirebaseAdmin.getInstance().Firestore;

async function addMessage({ uid, message, author }: AddMessageProps) {
  // message를 넣을 member의 reference를 uid로 찾기

  await FirebaseAdmin.getInstance().Firestore.runTransaction(
    async (transaction) => {
      const memberRef =
        FirestoreInstance.collection(MEMBER_COLLECTION).doc(uid);

      const memberData = await transaction.get(memberRef);
      if (!memberData.exists) {
        // 유저가 없는 경우 빠져나감
        throw new BadRequestError('유저가 존재하지 않습니다.');
      }

      const newMessageRef = memberRef.collection(MESSAGE_COLLECTION).doc();
      let newMessageContents: NewMessageProps = {
        message,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };
      if (author) {
        newMessageContents = {
          ...newMessageContents,
          author,
        };
      }

      await transaction.set(newMessageRef, newMessageContents);
    }
  );
}

async function getMessages(uid: string): Promise<Message[]> {
  // get messageRef by user id
  const memberRef = FirestoreInstance.collection(MEMBER_COLLECTION).doc(uid);

  const listData = FirestoreInstance.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);
    if (!memberDoc.exists) {
      throw new CustomServerError({
        statusCode: 400,
        message: '유저 정보가 없습니다.',
      });
    }

    const messageRef = memberRef
      .collection(MESSAGE_COLLECTION)
      .orderBy('createdAt', 'desc');
    const messageDoc = await transaction.get(messageRef);

    // extract data
    return messageDoc.docs.map((item) => {
      const docData = item.data() as Omit<MessageFromServer, 'id'>;
      const isDenied =
        docData.isDenied !== undefined && docData.isDenied === true;
      return {
        ...docData,
        message: isDenied ? '비공개 처리된 메세지입니다.' : docData.message,
        id: item.id,
        createdAt: docData.createdAt.toDate().toISOString(),
        repliedAt: docData.repliedAt
          ? docData.repliedAt.toDate().toISOString()
          : undefined,
      };
    });
  });

  return listData;
}

async function addReplyToMessage({ uid, messageId, reply }: ReplyProps) {
  const memberRef = FirestoreInstance.collection(MEMBER_COLLECTION).doc(uid);
  const messageRef = FirestoreInstance.collection(MEMBER_COLLECTION)
    .doc(uid)
    .collection(MESSAGE_COLLECTION)
    .doc(messageId);

  await FirestoreInstance.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef);

    if (!memberDoc.exists) {
      throw new CustomServerError({
        statusCode: 400,
        message: '유저 정보가 없습니다.',
      });
    }

    const messageDoc = await transaction.get(messageRef);
    if (!messageDoc.exists) {
      throw new CustomServerError({
        statusCode: 400,
        message: '메세지 아이템이 존재하지 않습니다.',
      });
    }

    // extract data
    const messageData = messageDoc.data() as MessageFromServer;
    if (messageData.reply) {
      throw new CustomServerError({
        statusCode: 400,
        message: '이미 댓글을 입력하였습니다.',
      });
    }

    await transaction.update(messageRef, {
      reply,
      repliedAt: firestore.FieldValue.serverTimestamp(),
    });
  });
}

async function getEachMessage({
  uid,
  messageId,
}: Omit<ReplyProps, 'reply'>): Promise<Message> {
  const memberRef = FirestoreInstance.collection(MEMBER_COLLECTION).doc(uid);
  const messageRef = FirestoreInstance.collection(MEMBER_COLLECTION)
    .doc(uid)
    .collection(MESSAGE_COLLECTION)
    .doc(messageId);

  const eachData = await FirestoreInstance.runTransaction(
    async (transaction) => {
      const memberDoc = await transaction.get(memberRef);

      if (!memberDoc.exists) {
        throw new CustomServerError({
          statusCode: 400,
          message: '유저 정보가 없습니다.',
        });
      }

      const messageDoc = await transaction.get(messageRef);
      if (!messageDoc.exists) {
        throw new CustomServerError({
          statusCode: 400,
          message: '메세지 아이템이 존재하지 않습니다.',
        });
      }

      // extract data
      const messageData = messageDoc.data() as MessageFromServer;
      const isDenied =
        messageData.isDenied !== undefined && messageData.isDenied === true;

      return {
        ...messageData,
        message: isDenied ? '비공개 처리된 메세지입니다.' : messageData.message,
        createdAt: messageData.createdAt.toDate().toISOString(),
        repliedAt: messageData.repliedAt
          ? messageData.repliedAt.toDate().toISOString()
          : undefined,
      };
    }
  );

  return eachData;
}

async function updateMessage({
  uid,
  messageId,
  isDenied,
}: {
  uid: string;
  messageId: string;
  isDenied: boolean;
}) {
  const memberRef = FirestoreInstance.collection(MEMBER_COLLECTION).doc(uid);
  const messageRef = FirestoreInstance.collection(MEMBER_COLLECTION)
    .doc(uid)
    .collection(MESSAGE_COLLECTION)
    .doc(messageId);

  const updated = await FirestoreInstance.runTransaction(
    async (transaction) => {
      const memberDoc = await transaction.get(memberRef);
      const messageDoc = await transaction.get(messageRef);

      if (!memberDoc.exists) {
        throw new CustomServerError({
          statusCode: 400,
          message: '유저 정보가 없습니다.',
        });
      }

      if (!messageDoc.exists) {
        throw new CustomServerError({
          statusCode: 400,
          message: '메세지 아이템이 존재하지 않습니다.',
        });
      }

      // update
      await transaction.update(messageRef, { isDenied });

      // returns value
      const messageData = messageDoc.data() as MessageFromServer;
      return {
        ...messageData,
        createdAt: messageData.createdAt.toDate().toISOString(),
        repliedAt: messageData.repliedAt
          ? messageData.repliedAt.toDate().toISOString()
          : undefined,
        isDenied,
      };
    }
  );

  return updated;
}

const MessageModel = {
  addMessage,
  getMessages,
  addReplyToMessage,
  getEachMessage,
  updateMessage,
};

export default MessageModel;
