import { HttpException, HttpStatus } from '@nestjs/common';

export class OkException extends HttpException {
  constructor(msg?: string) {
    super(
      {
        msg,
        status: HttpStatus.OK,
      },
      HttpStatus.OK,
    );
  }
}
