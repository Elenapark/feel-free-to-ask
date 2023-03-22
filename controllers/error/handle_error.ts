import { NextApiResponse } from 'next';
import CustomServerError from './custom_server_error';

export default function handleError(err: unknown, res: NextApiResponse) {
  let unknownError = err;

  if (!(err instanceof CustomServerError)) {
    unknownError = new CustomServerError({
      statusCode: 499,
      message: '알 수 없는 에러가 발생했습니다. 관리자에 문의해주세요.',
    });
  }

  const customError = unknownError as CustomServerError;
  res
    .status(customError.statusCode)
    .setHeader('location', customError.redirectLocation ?? '') // redirect location이 지정되는 300번대 에러인 경우
    .send(customError.serializErrors());
}
