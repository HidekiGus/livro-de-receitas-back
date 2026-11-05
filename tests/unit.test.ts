import jwt from 'jsonwebtoken';
import sharp from 'sharp';
import * as likeService from '../src/services/likeService';
import * as likeRepository from '../src/repositories/likeRepository';
import * as jwtResolver from '../src/utils/jwtResolver';
import { cropRecipeImageToLandscape } from '../src/services/imageService';

describe('Tests the like services and JWT verification', () => {
  it('Tests the likeRecipe function', async () => {
    jest
      .spyOn(likeRepository, 'likeRecipe')
      .mockImplementationOnce(async (): Promise<any> => true);

    jest
      .spyOn(jwtResolver, 'resolveJWT')
      .mockImplementationOnce(async (): Promise<any> => 'user-123');

    const result = await likeService.likeRecipe('Bearer valid-token', '1');

    expect(likeRepository.likeRecipe).toHaveBeenCalledWith('user-123', '1');
    expect(result).toBe(true);
  });

  it('Verifies valid JWT signature and rejects tampered tokens', async () => {
    const secret = process.env.JWT_SECRET || 'default_secret';
    const validToken = jwt.sign({ userId: 'abc-123' }, secret);

    const resolvedId = await jwtResolver.resolveJWT(`Bearer ${validToken}`);
    expect(resolvedId).toBe('abc-123');

    const forgedToken = jwt.sign({ userId: 'hacker-id' }, 'wrong_secret');
    await expect(
      jwtResolver.resolveJWT(`Bearer ${forgedToken}`)
    ).rejects.toEqual({
      type: 'unauthorized',
      message: 'Token de autenticação inválido ou expirado!',
    });
  });

  it('Smart-crops and converts an image to 720x480 landscape WebP', async () => {
    const sampleInputBuffer = await sharp({
      create: {
        width: 1000,
        height: 1200,
        channels: 3,
        background: { r: 220, g: 120, b: 40 },
      },
    })
      .png()
      .toBuffer();

    const processedBuffer = await cropRecipeImageToLandscape(sampleInputBuffer);
    const metadata = await sharp(processedBuffer).metadata();

    expect(metadata.format).toBe('webp');
    expect(metadata.width).toBe(720);
    expect(metadata.height).toBe(480);
  });
});
