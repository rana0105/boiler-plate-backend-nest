import { HttpException, HttpStatus } from '@nestjs/common';
import { BaseResponse } from '../../common/response/base.response';

export class ForbiddenBaseException extends HttpException {
  constructor(message: string = 'You do not have permission.') {
    super(BaseResponse.error(message, null, HttpStatus.FORBIDDEN), HttpStatus.FORBIDDEN);
  }
}