import * as fs from 'fs';

export const PROJECT_DIR = process.cwd();

export const createDirectory = (path: fs.PathLike) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, {}, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

export const createFile = (
  path: fs.PathLike,
  file: string | NodeJS.ArrayBufferView,
) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, file, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};
