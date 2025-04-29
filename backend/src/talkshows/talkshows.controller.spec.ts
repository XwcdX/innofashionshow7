import { Test, TestingModule } from '@nestjs/testing';
import { TalkshowsController } from './talkshows.controller';
import { TalkshowsService } from './talkshows.service';

describe('TalkshowsController', () => {
  let controller: TalkshowsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TalkshowsController],
      providers: [TalkshowsService],
    }).compile();

    controller = module.get<TalkshowsController>(TalkshowsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
