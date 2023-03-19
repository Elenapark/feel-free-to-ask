import type { NextApiRequest, NextApiResponse } from 'next';
import FirebaseAdmin from '@/models/firebase_admin';
import { AuthUserProps } from '@/models/types/auth_user';
import MemberModel from '@/models/member/member.model';

type Data = {
  message: string;
  result: boolean;
  userInfo?: AuthUserProps;
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

  const addResult = await MemberModel.add({
    uid,
    email,
    displayName,
    photoURL,
  });

  if (addResult.result) {
    return res.status(200).json(addResult);
  }
  return res.status(500).json(addResult);
}
