/**
 * request value체크 및 model사용
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { AuthUserProps } from '@/models/types/auth_user';
import MemberModel from '@/models/member/member.model';
import BadRequestError from './error/bad_request_error';

type Data = {
  message: string;
  result: boolean;
  userInfo?: AuthUserProps;
};

async function add(req: NextApiRequest, res: NextApiResponse<Data>) {
  const {
    body: { uid, email, displayName, photoURL },
  } = req;

  if (uid === null || uid === undefined) {
    throw new BadRequestError('uid가 누락되었습니다.');
  }
  if (email === null || email === undefined) {
    throw new BadRequestError('email이 누락되었습니다.');
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

async function getInfoByScreenName(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { screenName },
  } = req;

  if (!screenName) {
    throw new BadRequestError('displayName이 누락되었습니다.');
  }

  const screenNameParam = Array.isArray(screenName)
    ? screenName[0]
    : screenName;

  const memberInfoResult = await MemberModel.getInfoByScreenName(
    screenNameParam
  );

  if (!memberInfoResult) {
    return res.status(404).end();
  }
  return res.status(200).json(memberInfoResult);
}

const MemberController = {
  add,
  getInfoByScreenName,
};

export default MemberController;
