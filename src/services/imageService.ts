import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import crypto from 'crypto';

const LANDSCAPE_WIDTH = 720;
const LANDSCAPE_HEIGHT = 480;

function getR2Client(): S3Client {
  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw {
      type: 'badRequest',
      message:
        'As credenciais do Cloudflare R2 (R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY) não estão configuradas no servidor.',
    };
  }

  return new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export async function cropRecipeImageToLandscape(
  fileBuffer: Buffer
): Promise<Buffer> {
  try {
    return await sharp(fileBuffer)
      .rotate()
      .resize({
        width: LANDSCAPE_WIDTH,
        height: LANDSCAPE_HEIGHT,
        fit: 'cover',
        position: sharp.strategy.attention,
      })
      .webp({ quality: 80 })
      .toBuffer();
  } catch (_error) {
    throw {
      type: 'unprocessableEntity',
      message: 'Arquivo de imagem inválido ou corrompido!',
    };
  }
}

export async function processAndUploadRecipeImage(
  fileBuffer: Buffer
): Promise<string> {
  const bucketName = process.env.R2_BUCKET_NAME;
  const publicBaseUrl = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');

  if (!bucketName || !publicBaseUrl) {
    throw {
      type: 'badRequest',
      message:
        'As configurações do bucket Cloudflare R2 (R2_BUCKET_NAME, R2_PUBLIC_URL) não estão configuradas no servidor.',
    };
  }

  const optimizedBuffer = await cropRecipeImageToLandscape(fileBuffer);
  const fileName = `recipes/${crypto.randomUUID()}.webp`;

  const r2Client = getR2Client();
  await r2Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: optimizedBuffer,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );

  return `${publicBaseUrl}/${fileName}`;
}
