import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request)', () => {
    const email = 'semih1sa2@gmail.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'semih.im' })
      .expect(201)
      .then(res => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toBe(email);
      });
  });

  it('signup as a new user and get the currently logged in user', async () => {
    const email = 'semai@gmail.com';
    const res = await request(app.getHttpServer()).post('/auth/signup').send({ email, password: 'semih.im' }).expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer()).get('/auth/whoami').set('Cookie', cookie).expect(200);

    expect(body.email).toEqual(email);
  });
});
