import { Controller, Post, Request, Get, Query } from '@nestjs/common';

@Controller('error-collection')
export class ErrorCollectionController {
  @Post()
  postErrorCollectionFn(@Request() req, @Query() query) {
    req.on('data', (reqs) => {
      console.log(JSON.parse(reqs.toString()));
    });
    console.log(query, 'postQuery');
  }
  @Get()
  getErrorCollectionFn(@Query() query) {
    console.log(query, 'getQuery');
  }
}
