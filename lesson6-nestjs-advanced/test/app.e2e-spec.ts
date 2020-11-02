import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/purchase (GET)', () => {
    return request(app.getHttpServer())
      .get('/purchase')
      .expect(200);
  });

  it('/purchase (POST)', () => {
    return request(app.getHttpServer())
      .post('/purchase')
      .send({ amount: '500' })
      .expect(302);
  });
});
