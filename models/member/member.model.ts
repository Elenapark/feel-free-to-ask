import { AuthUserProps } from '@/models/types/auth_user';
import FirebaseAdmin from '../firebase_admin';

const MEMBER_COLLECTION = 'members';
const SCREEN_NAME_COLLECTION = 'screen_names';

type AddReturnProps =
  | { message: string; result: true; userInfo: AuthUserProps }
  | { message: string; result: false };

async function add({
  uid,
  email,
  displayName,
  photoURL,
}: AuthUserProps): Promise<AddReturnProps> {
  try {
    const screenName = (email as string).split('@')[0];
    const result = await FirebaseAdmin.getInstance().Firebase.runTransaction(
      async (transaction) => {
        const memberRef = FirebaseAdmin.getInstance()
          .Firebase.collection(MEMBER_COLLECTION)
          .doc(uid);

        const screenNameRef = FirebaseAdmin.getInstance()
          .Firebase.collection(SCREEN_NAME_COLLECTION)
          .doc(screenName);

        const memberData = await transaction.get(memberRef);
        if (memberData.exists) {
          // 유저가 이미 있는 경우 저장없이 빠져나감
          console.error('member 정보가 이미 존재합니다.');
          return false;
        }

        const newMember = {
          uid,
          email: email ?? '',
          displayName: displayName ?? '',
          photoURL: photoURL ?? '',
        };

        await transaction.set(memberRef, newMember);
        await transaction.set(screenNameRef, newMember);
        return true;
      }
    );

    if (!result) {
      return {
        message: '데이터가 성공적으로 저장되었어요!',
        result: true,
        userInfo: {
          uid,
          email,
          displayName,
          photoURL,
        },
      };
    }
    return {
      message: '데이터가 성공적으로 저장되었어요!',
      result: true,
      userInfo: {
        uid,
        email,
        displayName,
        photoURL,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      message: '데이터 저장에 실패했습니다. 관리자에 문의해주세요.',
      result: false,
    };
  }
}

const MemberModel = {
  add,
};

export default MemberModel;
