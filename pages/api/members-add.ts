import type { NextApiRequest, NextApiResponse } from 'next';
import { AuthUserProps } from '@/models/types/auth_user';
import MemberController from '@/controllers/member.ctrl';
import handleError from '@/controllers/error/handle_error';
import checkSupportedMethod from '@/controllers/error/check_supported_method';

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
    // POST METHOD 여부 체크
    checkSupportedMethod(supportedMethod, method!);
    await MemberController.add(req, res);
  } catch (err) {
    console.error('캐치된 에러:', err);
    handleError(err, res);
  }
}
