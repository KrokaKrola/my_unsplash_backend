export const stringifyError = (err: Error, filter?: any, space?: string) => {
  const plainObject = {};
  Object.getOwnPropertyNames(err).forEach((key) => {
    plainObject[key] = err[key];
  });

  return JSON.stringify(plainObject, filter, space);
};
