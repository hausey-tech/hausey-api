import crypto from 'crypto';

export function generateRandomCode(input: string) {
  const hash = crypto.createHash('sha256');
  const hashedInput = hash.update(input).digest('hex');
  const randomString = hashedInput.slice(0, 6).toUpperCase();

  return randomString;
}
