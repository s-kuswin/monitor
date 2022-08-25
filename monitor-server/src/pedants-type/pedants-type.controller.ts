import { Controller, Get, Param } from '@nestjs/common';

@Controller('pedants-type')
export class PedantsTypeController {
  @Get()
  getPedantsType():string {
    return '获取所有挂件类型'
  }
  @Get('/:id')
  getPedantsTypeById(@Param('id')  id: number) {
    console.log('======id', id);
    return `${typeof id} and id is ${id}`
  }
}
