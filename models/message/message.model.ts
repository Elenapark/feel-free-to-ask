import BadRequestError from '@/controllers/error/bad_request_error';
import FirebaseAdmin from '@/models/firebase_admin';
import { firestore } from 'firebase-admin';
import { AuthUserProps } from '../types/auth_user';

const MEMBER_COLLECTION = 'members';
const MESSAGE_COLLECTION = 'messages';

interface AddMessageProps {
  uid: string;
  message: string;
  author?: Pick<AuthUserProps, 'displayName' | 'photoURL'>;
}

type NewMessageProps = Omit<AddMessageProps, 'uid'> & {
  createdAt: firestore.FieldValue;
};

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

const MessageModel = {
  addMessage,
};

export default MessageModel;
