import client from '../database/database';

export async function createUser(
  name: string,
  email: string,
  password: string
) {
  // kept for future use
  await client.connect();
  try {
    const db = client.db('livro-de-receitas');
    await db.collection('users').insertOne({ name, email, password });
  } finally {
    await client.close();
  }
}

export async function getUsers() {
  await client.connect();
  try {
    const db = client.db('livro-de-receitas');
    const result = await db.collection('users').find().toArray();
    return result;
  } finally {
    await client.close();
  }
}

export async function findUserByEmail(email: string) {
  await client.connect();
  try {
    const db = client.db('livro-de-receitas');
    const result = await db.collection('users').findOne({ email });
    return result;
  } finally {
    await client.close();
  }
}
