export default class CustomServerError extends Error {
  public statusCode: number;

  public redirectLocation?: string;

  constructor({
    statusCode = 500,
    message,
    redirectLocation,
  }: {
    statusCode?: number;
    message: string;
    redirectLocation?: string;
  }) {
    super(message);
    this.statusCode = statusCode;
    this.redirectLocation = redirectLocation;
  }

  // 에러메세지 문자열로 표기
  serializErrors(): { message: string } | string {
    return { message: this.message };
  }
}
