import { Test, TestingModule } from '@nestjs/testing';
import { ErrorCollectionController } from './error-collection.controller';

describe('ErrorCollectionController', () => {
  let controller: ErrorCollectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ErrorCollectionController],
    }).compile();

    controller = module.get<ErrorCollectionController>(ErrorCollectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
