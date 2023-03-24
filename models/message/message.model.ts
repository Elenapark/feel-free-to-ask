import BadRequestError from '@/controllers/error/bad_request_error';
import CustomServerError from '@/controllers/error/custom_server_error';
import FirebaseAdmin from '@/models/firebase_admin';
import { firestore } from 'firebase-admin';
import { AuthUserProps } from '../types/auth_user';

const MEMBER_COLLECTION = 'members';
const MESSAGE_COLLECTION = 'messages';

export interface AddMessageProps {
  uid: string;
  message: string;
  author?: Pick<AuthUserProps, 'displayName' | 'photoURL'>;
}

export type NewMessageProps = Omit<AddMessageProps, 'uid'> & {
  createdAt: firestore.Timestamp;
};

export interface MessageListProps {
  id: string;
  createdAt: string;
  repliedAt: string | undefined;
  message: string;
  author?: Pick<AuthUserProps, 'displayName' | 'photoURL'> | undefined;
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

async function getMessages(uid: string): Promise<MessageListProps[]> {
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

    const messageRef = memberRef.collection(MESSAGE_COLLECTION);
    const messageDoc = await transaction.get(messageRef);
    return messageDoc.docs.map((item) => {
      const docData = item.data() as NewMessageProps & {
        repliedAt?: firestore.Timestamp;
      };
      return {
        ...docData,
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

const MessageModel = {
  addMessage,
  getMessages,
};

export default MessageModel;
