export class UnknownError extends Error {
  name = 'UnknownError';

  status = 420;

  constructor() {
    super(
      'Unknown errors, please open the debug console to collect more information.'
    );
  }
}

export const serializeError = (err: Error) => {
  const error = 'name: ' + err.name + '\n';

  if (err.stack) {
    return error + err.stack;
  }

  return error;
};
