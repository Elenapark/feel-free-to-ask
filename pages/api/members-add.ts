import type { NextApiRequest, NextApiResponse } from 'next';
import { AuthUserProps } from '@/models/types/auth_user';
import MemberController from '@/controllers/member.ctrl';

type Data = {
  message: string;
  result: boolean;
  userInfo?: AuthUserProps;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;
  const supportedMethod = ['POST'];

  try {
    // POST METHOD여부 체크
    if (!supportedMethod.includes(method!)) {
      // throws an error
    }
    await MemberController.add(req, res);
  } catch (err) {
    console.error(err);
    // throws an error
  }
}
