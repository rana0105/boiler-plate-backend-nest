import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  myFirstMethod(): string {
    return 'This is my first method!';
  }
}
