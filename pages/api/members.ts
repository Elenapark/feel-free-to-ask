import type { NextApiRequest, NextApiResponse } from 'next';
import FirebaseAdmin from '@/models/firebase_admin';
import { AuthUserProps } from '@/models/types/auth_user';

type Data = {
  message: string;
  result: AuthUserProps | boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    body: { uid, email, displayName, photoURL },
  } = req;

  if (uid === null || uid === undefined) {
    return res.status(400).json({
      message: 'uid가 누락되었습니다.',
      result: false,
    });
  }
  if (email === null || email === undefined) {
    return res.status(400).json({
      message: 'email이 누락되었습니다.',
      result: false,
    });
  }

  const screenName = (email as string).split('@')[0];
  try {
    const result = await FirebaseAdmin.getInstance().Firebase.runTransaction(
      async (transaction) => {
        const memberRef = FirebaseAdmin.getInstance()
          .Firebase.collection('members')
          .doc(uid);

        const screenNameRef = FirebaseAdmin.getInstance()
          .Firebase.collection('screen_names')
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
      return res.status(201).json({
        message: '데이터가 성공적으로 저장되었어요!',
        result: {
          uid,
          email,
          displayName,
          photoURL,
        },
      });
    }
    return res.status(200).json({
      message: '데이터가 성공적으로 저장되었어요!',
      result: {
        uid,
        email,
        displayName,
        photoURL,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '데이터 저장에 실패했습니다. 관리자에 문의해주세요.',
      result: false,
    });
  }
}
