import checkSupportedMethod from '@/controllers/error/check_supported_method';
import BadRequestError from '../bad_request_error';

describe('check supported method function', () => {
  it('does not throw an error if supported methods array supports requested method', () => {
    expect(() => checkSupportedMethod(['POST'], 'POST')).not.toThrow();
  });

  describe('Throw errors', () => {
    it('throws an error if supported methods array does not support requested method', () => {
      expect(() => checkSupportedMethod(['POST'], 'GET')).toThrow(
        new BadRequestError('지원하지 않는 METHOD 형식입니다.')
      );
    });
  });
});
