import supertest from 'supertest';
import app from '../src/app';
import { disconnectDatabase } from '../src/database/database';

afterAll(async () => {
  await disconnectDatabase();
});

describe('Integration Tests', () => {
  it('GET / returns API status check 200', async () => {
    const result = await supertest(app).get('/');
    expect(result.status).toEqual(200);
  });

  it('POST /recipes returns 422 with empty body', async () => {
    const result = await supertest(app).post('/recipes').send({});
    expect(result.status).toEqual(422);
  });

  it('POST /signup returns 422 with invalid payload', async () => {
    const result = await supertest(app).post('/signup').send({ email: 'not-an-email' });
    expect(result.status).toEqual(422);
  });
});
