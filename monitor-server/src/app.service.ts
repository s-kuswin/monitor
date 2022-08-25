import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      code: 200,
      data: {
        massage: '成功',
      },
    };
  }
}
