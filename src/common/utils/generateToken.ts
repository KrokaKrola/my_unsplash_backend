import * as crypto from 'crypto';

export const generateToken = ({ byteLength = 64 } = {}): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(byteLength, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer.toString('base64'));
      }
    });
  });
};
