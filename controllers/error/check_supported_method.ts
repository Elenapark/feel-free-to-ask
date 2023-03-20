import BadRequestError from './bad_request_error';

export default function checkSupportedMethod(
  supportedMethod: string[],
  requestMethod: string
) {
  if (!supportedMethod.includes(requestMethod)) {
    // throw bad requrest error
    throw new BadRequestError('지원하지 않는 METHOD 형식입니다.');
  }
}
