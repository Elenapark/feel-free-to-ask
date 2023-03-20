import BadRequestError from './bad_request_error';

export default function checkSupportedMethod(
  supportedMethod: string[],
  requestMethod: string
) {
  if (!supportedMethod || !requestMethod) {
    throw new Error('전달된 props가 없습니다.');
  }
  if (!supportedMethod.includes(requestMethod)) {
    // throw bad requrest error
    throw new BadRequestError('지원하지 않는 METHOD 형식입니다.');
  }
}
