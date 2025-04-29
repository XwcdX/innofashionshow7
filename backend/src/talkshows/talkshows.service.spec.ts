import { Test, TestingModule } from '@nestjs/testing';
import { TalkshowsService } from './talkshows.service';

describe('TalkshowsService', () => {
  let service: TalkshowsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TalkshowsService],
    }).compile();

    service = module.get<TalkshowsService>(TalkshowsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
